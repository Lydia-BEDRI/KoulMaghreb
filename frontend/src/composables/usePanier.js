import { ref, computed, watch, onMounted } from 'vue'
import { panierService } from '@/services/panierService.js'
import { useAuth } from '@/composables/useAuth'
import { useToast } from 'vue-toastification'

const panier = ref([])
const loading = ref(false)
const error = ref(null)

export const usePanier = () => {
  const { isAuthenticated, token } = useAuth()
  const toast = useToast()

  const totalItems = computed(() => {
    if (isAuthenticated.value) {
      return panier.value.reduce((total, item) => total + parseInt(item.quantite || 0), 0)
    } else {
      const panierLocal = panierService.getPanierLocal()
      return panierLocal.reduce((total, item) => total + parseInt(item.quantite || 0), 0)
    }
  })

  const totalPrix = computed(() => {
    if (isAuthenticated.value) {
      return panier.value.reduce((total, item) => {
        const sousTotal = parseFloat(item.sous_total || 0)
        return total + sousTotal
      }, 0)
    } else {
      return panierService.getTotalPanierLocal()
    }
  })

  const isEmpty = computed(() => {
    if (isAuthenticated.value) {
      return panier.value.length === 0
    } else {
      return panierService.getPanierLocal().length === 0
    }
  })

  const getToken = () => {
    return token?.value || localStorage.getItem('auth_token')
  }

  const chargerPanier = async () => {
    loading.value = true
    error.value = null
    
    try {
      if (isAuthenticated.value) {
        const currentToken = getToken()
        if (currentToken) {
          const response = await panierService.getPanier(currentToken)
          panier.value = response.panier || []
        } else {
          panier.value = panierService.reparerPanierLocal()
        }
      } else {
        panier.value = panierService.reparerPanierLocal()
      }
    } catch (err) {
      error.value = err.message
      console.error('Erreur lors du chargement du panier:', err)
      panier.value = panierService.reparerPanierLocal()
    } finally {
      loading.value = false
    }
  }

  const peutAccederAuPanier = () => {
    return isAuthenticated.value
  }

  const ajouterAuPanier = async (item) => {
    loading.value = true
    error.value = null

    try {
      if (isAuthenticated.value) {
        const currentToken = getToken()
        
        if (currentToken) {
          const result = await panierService.ajouterAuPanier(item, currentToken)
          toast.success('Article ajouté au panier')
        } else {
          throw new Error('Token manquant')
        }
      } else {
        if (item.type === 'plat') {
          const plat = await obtenirDetailsPlat(item.plat_id)
          panierService.ajouterAuPanierLocal({
            ...item,
            prix_unitaire: parseFloat(plat.prix),
            details: { plat }
          })
        } else if (item.type === 'reservation') {
          const evenement = await obtenirDetailsEvenement(item.evenement_id)
          panierService.ajouterAuPanierLocal({
            ...item,
            prix_unitaire: parseFloat(evenement.prix_par_personne),
            details: { evenement }
          })
        }
        toast.success('Article ajouté au panier')
      }
      
      await chargerPanier()
      
    } catch (err) {
      error.value = err.message
      toast.error(err.message || 'Erreur lors de l\'ajout au panier')
    } finally {
      loading.value = false
    }
  }

  const modifierQuantite = async (itemId, quantite) => {
    if (quantite < 1) return

    loading.value = true
    error.value = null

    try {
      if (isAuthenticated.value) {
        const currentToken = getToken()
        if (currentToken) {
          await panierService.modifierQuantite(itemId, quantite, currentToken)
        } else {
          throw new Error('Token manquant')
        }
      } else {
        panierService.modifierQuantiteLocal(itemId, quantite)
      }
      
      await chargerPanier()
      
    } catch (err) {
      error.value = err.message
      toast.error(err.message || 'Erreur lors de la modification')
    } finally {
      loading.value = false
    }
  }

  const supprimerItem = async (itemId) => {
    loading.value = true
    error.value = null

    try {
      if (isAuthenticated.value) {
        const currentToken = getToken()
        if (currentToken) {
          await panierService.supprimerItem(itemId, currentToken)
        } else {
          throw new Error('Token manquant')
        }
      } else {
        panierService.supprimerItemLocal(itemId)
      }
      
      await chargerPanier()
      toast.success('Article supprimé du panier')
      
    } catch (err) {
      error.value = err.message
      toast.error(err.message || 'Erreur lors de la suppression')
    } finally {
      loading.value = false
    }
  }

  const viderPanier = async () => {
    loading.value = true
    error.value = null

    try {
      if (isAuthenticated.value) {
        const currentToken = getToken()
        if (currentToken) {
          await panierService.viderPanier(currentToken)
        } else {
          throw new Error('Token manquant')
        }
      } else {
        panierService.viderPanierLocal()
      }
      
      panier.value = []
      toast.success('Panier vidé')
      
    } catch (err) {
      error.value = err.message
      toast.error(err.message || 'Erreur lors du vidage du panier')
    } finally {
      loading.value = false
    }
  }

  const synchroniserPanier = async () => {
    if (!isAuthenticated.value) return

    const panierLocal = panierService.getPanierLocal()
    if (panierLocal.length === 0) return

    loading.value = true
    
    try {
      const currentToken = getToken()
      if (!currentToken) return

      for (const item of panierLocal) {
        await panierService.ajouterAuPanier({
          type: item.type,
          plat_id: item.plat_id,
          evenement_id: item.evenement_id,
          quantite: item.quantite
        }, currentToken)
      }
      
      panierService.viderPanierLocal()
      
      await chargerPanier()
      
      toast.success(`🛒 Parfait ! Votre panier (${panierLocal.length} article${panierLocal.length > 1 ? 's' : ''}) a été synchronisé !`, {
        timeout: 4000
      })
      
    } catch (err) {
      console.error('Erreur lors de la synchronisation:', err)
      toast.warning('Erreur lors de la synchronisation du panier. Vos articles locaux sont préservés.')
    } finally {
      loading.value = false
    }
  }

  const obtenirDetailsPlat = async (platId) => {
    
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/plats/${platId}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Plat non trouvé (${response.status})`);
    }
    
    const data = await response.json();
    
    return data;
  }

  const obtenirDetailsEvenement = async (evenementId) => {
    
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/evenements/${evenementId}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Événement non trouvé (${response.status})`);
    }
    
    const data = await response.json();
    
    return data;
  }

  watch(isAuthenticated, (newVal, oldVal) => {
    if (newVal && !oldVal) {
      synchroniserPanier()
    } else if (!newVal && oldVal) {
      chargerPanier()
    }
  })

  onMounted(() => {
    chargerPanier()
  })

  return {
    panier: computed(() => panier.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    
    totalItems,
    totalPrix,
    isEmpty,
    
    chargerPanier,
    ajouterAuPanier,
    modifierQuantite,
    supprimerItem,
    viderPanier,
    synchroniserPanier,
    peutAccederAuPanier
  }
}