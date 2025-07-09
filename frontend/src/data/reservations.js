export const reservations = [
  {
    id: 1,
    numeroReservation: 'RSV-001',
    user_id: 1,
    client: {
      nom: 'Amine Djerad',
      email: 'amine.djerad@email.com',
      telephone: '+33 6 12 34 56 78'
    },
    evenement: {
      id: 1,
      titre: 'Soirée Couscous & Musique Andalouse',
      date: '2025-07-10T20:00:00',
      lieu: 'Paris'
    },
    nombrePlaces: 4,
    statut: 'Confirmée',
    created_at: '2025-07-05T14:30:00',
    notesAdmin: 'Réservation VIP, table près de la scène',
    montantTotal: 120.00
  },
  {
    id: 2,
    numeroReservation: 'RSV-002',
    user_id: 2,
    client: {
      nom: 'Yasmine Zidane',
      email: 'yasmine.z@email.com',
      telephone: '+33 6 98 76 54 32'
    },
    evenement: {
      id: 2,
      titre: 'Buffet spécial Ramadan',
      date: '2025-07-15T18:00:00',
      lieu: 'Paris'
    },
    nombrePlaces: 2,
    statut: 'En attente',
    created_at: '2025-07-06T12:15:00',
    notesAdmin: 'Demande végétarienne',
    montantTotal: 80.00
  },
  {
    id: 3,
    numeroReservation: 'RSV-003',
    user_id: 3,
    client: {
      nom: 'Rachid Benzema',
      email: 'rachid.b@email.com',
      telephone: '+33 6 45 67 89 12'
    },
    evenement: {
      id: 3,
      titre: 'Atelier pâtisseries orientales',
      date: '2025-07-20T14:00:00',
      lieu: 'Paris'
    },
    nombrePlaces: 1,
    statut: 'Annulée',
    created_at: '2025-07-07T11:45:00',
    notesAdmin: 'Annulation 24h avant - remboursement effectué',
    montantTotal: 45.00
  },
  {
    id: 4,
    numeroReservation: 'RSV-004',
    user_id: 4,
    client: {
      nom: 'Lina Amrani',
      email: 'lina.amrani@email.com',
      telephone: '+33 6 33 44 55 66'
    },
    evenement: {
      id: 4,
      titre: 'Soirée Chaâbi et Tajine Royal',
      date: '2025-07-25T21:00:00',
      lieu: 'Paris'
    },
    nombrePlaces: 6,
    statut: 'Confirmée',
    created_at: '2025-07-08T10:20:00',
    notesAdmin: '',
    montantTotal: 270.00
  },
  {
    id: 5,
    numeroReservation: 'RSV-005',
    user_id: 5,
    client: {
      nom: 'Mohamed El Mansouri',
      email: 'mohamed.elmansouri@email.com',
      telephone: '+33 6 77 88 99 00'
    },
    evenement: {
      id: 1,
      titre: 'Soirée Couscous & Musique Andalouse',
      date: '2025-07-10T20:00:00',
      lieu: 'Paris'
    },
    nombrePlaces: 8,
    statut: 'Confirmée',
    created_at: '2025-07-04T19:45:00',
    notesAdmin: 'Réservation groupe - demande facture entreprise',
    montantTotal: 240.00
  }
]