export const commandes = [
  {
    id: 1,
    numeroCommande: 'CMD-001',
    user_id: 1,
    client: {
      nom: 'Amine Djerad',
      email: 'amine.djerad@email.com',
      telephone: '+33 6 12 34 56 78'
    },
    total: 52.00,
    created_at: '2025-07-09T14:30:00',
    statut: 'En préparation',
    notesAdmin: 'Client régulier, priorité haute',
    items: [
      { nom: 'Couscous Royal', prix: 18, quantite: 2 },
      { nom: 'Tajine de Poulet', prix: 16, quantite: 1 }
    ]
  },
  {
    id: 2,
    numeroCommande: 'CMD-002',
    user_id: 2,
    client: {
      nom: 'Yasmine Zidane',
      email: 'yasmine.z@email.com',
      telephone: '+33 6 98 76 54 32'
    },
    total: 41.00,
    created_at: '2025-07-09T12:15:00',
    statut: 'Livrée',
    notesAdmin: 'Livraison express demandée',
    items: [
      { nom: 'Bricks à l\'œuf', prix: 7, quantite: 3 },
      { nom: 'Makroud', prix: 5, quantite: 4 }
    ]
  },
  {
    id: 3,
    numeroCommande: 'CMD-003',
    user_id: 3,
    client: {
      nom: 'Rachid Benzema',
      email: 'rachid.b@email.com',
      telephone: '+33 6 45 67 89 12'
    },
    total: 38.00,
    created_at: '2025-07-09T11:45:00',
    statut: 'Annulée',
    notesAdmin: 'Annulation demandée par le client',
    items: [
      { nom: 'Chorba', prix: 10, quantite: 2 },
      { nom: 'Couscous Royal', prix: 18, quantite: 1 }
    ]
  },
  {
    id: 4,
    numeroCommande: 'CMD-004',
    user_id: 4,
    client: {
      nom: 'Lina Amrani',
      email: 'lina.amrani@email.com',
      telephone: '+33 6 33 44 55 66'
    },
    total: 29.00,
    created_at: '2025-07-09T10:20:00',
    statut: 'En attente',
    notesAdmin: '',
    items: [
      { nom: 'Tajine de Poulet', prix: 16, quantite: 1 },
      { nom: 'Harira', prix: 8, quantite: 1 },
      { nom: 'Makroud', prix: 5, quantite: 1 }
    ]
  },
  {
    id: 5,
    numeroCommande: 'CMD-005',
    user_id: 5,
    client: {
      nom: 'Mohamed El Mansouri',
      email: 'mohamed.elmansouri@email.com',
      telephone: '+33 6 77 88 99 00'
    },
    total: 65.00,
    created_at: '2025-07-08T19:45:00',
    statut: 'Prête',
    notesAdmin: 'Commande pour événement familial',
    items: [
      { nom: 'Couscous Royal', prix: 18, quantite: 2 },
      { nom: 'Tajine de Poulet', prix: 16, quantite: 1 },
      { nom: 'Pastilla au Poulet', prix: 15, quantite: 1 }
    ]
  }
]