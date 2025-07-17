import { ref, computed, watch, onMounted } from 'vue'
import { panierService } from '@/services/panierService.js'
import { useAuth } from '@/composables/useAuth'
import { useToast } from 'vue-toastification'
import { commandesService } from '@/services/commandesService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

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

  const passerCommande = async () => {
    try {
      if (!isAuthenticated.value) {
        throw new Error('Vous devez être connecté pour passer une commande')
      }

      if (panier.value.length === 0) {
        throw new Error('Votre panier est vide')
      }

      const currentToken = token?.value || localStorage.getItem('auth_token')
      if (!currentToken) {
        throw new Error('Session expirée, veuillez vous reconnecter')
      }

      const items = []
      
      for (const item of panier.value) {
        if (item.type === 'plat') {
          const itemDetails = getItemDetails(item)
          const platId = item.plat_id || item.id
          const nomPlat = itemDetails.nom || item.nom || 'Article'
          const prix = parseFloat(item.prix_unitaire || itemDetails.prix || 0)
          
          if (prix <= 0) {
            continue
          }
          
          items.push({
            plat_id: platId,
            nom_plat: nomPlat,
            prix: prix,
            quantite: parseInt(item.quantite || 1)
          })
        }
      }

      if (items.length === 0) {
        throw new Error('Aucun article valide dans le panier')
      }

      const response = await commandesService.creerCommande(items, currentToken)
      
      await viderPanier()

      return response

    } catch (error) {
      throw error
    }
  }

  const getItemDetails = (item) => {
    try {
      if (typeof item.item_details === 'string') {
        return JSON.parse(item.item_details)
      } else if (typeof item.item_details === 'object') {
        return item.item_details || {}
      }
      return {}
    } catch (e) {
      return {}
    }
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
    peutAccederAuPanier,
    passerCommande
  }
}