const bcrypt = require('bcryptjs');
const { query } = require('./connection');

const seedData = {
  utilisateurs: [
    {
      prenom: 'Amine',
      nom: 'Djerad',
      email: 'amine.djerad@email.com',
      password: 'password123',
      telephone: '+33 6 12 34 56 78',
      adresse: '123 Rue de la Paix, Paris',
      code_postal: '75001',
      statut: 'Actif',
      role: 'Client'
    },
    {
      prenom: 'Yasmine',
      nom: 'Zidane',
      email: 'yasmine.z@email.com',
      password: 'password123',
      telephone: '+33 6 98 76 54 32',
      adresse: '456 Avenue des Champs, Paris',
      code_postal: '75002',
      statut: 'Actif',
      role: 'Client'
    },
    {
      prenom: 'Rachid',
      nom: 'Benzema',
      email: 'rachid.b@email.com',
      password: 'password123',
      telephone: '+33 6 45 67 89 12',
      adresse: '789 Boulevard Saint-Michel, Paris',
      code_postal: '75005',
      statut: 'Suspendu',
      role: 'Client'
    },
    {
      prenom: 'Admin',
      nom: 'KoulMaghreb',
      email: 'admin@koulmaghreb.com',
      password: 'admin123',
      telephone: '+33 6 00 00 00 00',
      adresse: 'Paris, France',
      code_postal: '75000',
      statut: 'Actif',
      role: 'Admin'
    }
  ],

  articles: [
    {
      title: "Le Couscous : Roi des plats maghrébins",
      slug: "couscous-roi-des-plats",
      excerpt: "Découvrez pourquoi le couscous est le plat emblématique du Maghreb.",
      content: "Le couscous est bien plus qu'un simple plat : il incarne la convivialité et la tradition dans tout le Maghreb. Préparé à base de semoule de blé dur, il se décline en de nombreuses variantes selon les régions et les familles. On le sert généralement accompagné de légumes mijotés, de pois chiches, et de viandes telles que l'agneau ou le poulet. Le couscous est souvent le plat central lors des grandes occasions, des fêtes religieuses ou des réunions familiales. Sa préparation, parfois longue, est un moment de partage et de transmission entre générations. Aujourd'hui, il est reconnu patrimoine culturel immatériel de l'humanité par l'UNESCO.",
      image: "/img/articles/couscous.jpeg",
      category: "Culture"
    },
    {
      title: "Ramadan : Les traditions culinaires au Maghreb",
      slug: "ramadan-traditions-culinaires",
      excerpt: "Un voyage gourmand à travers les spécialités de Ramadan.",
      content: "Le mois de Ramadan est une période de spiritualité mais aussi de partage culinaire au Maghreb. Chaque soir, la rupture du jeûne, appelée iftar, est l'occasion de savourer des mets traditionnels : la harira marocaine, la chorba algérienne, les bricks tunisiennes, sans oublier les dattes et les pâtisseries au miel. Les familles se réunissent autour de tables généreuses où la soupe chaude précède souvent des plats mijotés et des douceurs sucrées. Les marchés s'animent, les odeurs d'épices envahissent les rues, et la cuisine devient le cœur battant de la maison durant tout le mois sacré.",
      image: "/img/articles/ramadan.jpeg",
      category: "Tradition"
    },
    {
      title: "Les épices incontournables de la cuisine maghrébine",
      slug: "epices-cuisine-maghreb",
      excerpt: "Cumin, ras-el-hanout, coriandre... Découvrez leurs secrets.",
      content: "La cuisine maghrébine doit sa richesse et sa diversité à l'utilisation généreuse des épices. Le ras-el-hanout, mélange complexe de plusieurs épices, parfume couscous et tajines. Le cumin, la coriandre, le paprika, le curcuma et le gingembre sont omniprésents dans les plats. Chaque épice a son histoire et son usage : le cumin relève les soupes, la cannelle adoucit les desserts, et le safran colore les sauces. Les épices ne servent pas seulement à donner du goût, elles racontent aussi les échanges commerciaux et culturels qui ont façonné la région au fil des siècles.",
      image: "/img/articles/epices.jpeg",
      category: "Ingrédients"
    }
  ],

  plats: [
    {
      nom: 'Couscous Royal',
      prix: 18.00,
      note: 4.8,
      image: '/src/assets/img/cuisine-alg/couscous-algerien.jpeg',
      short_desc: 'Un plat traditionnel à base de semoule fine, accompagné de légumes frais, de pois chiches et d\'un assortiment généreux de viandes (agneau, poulet, merguez), relevé d\'épices parfumées.',
      long_desc: 'Le couscous royal est un plat emblématique du Maghreb, symbole de convivialité et de partage. Il se compose de semoule de blé roulée à la main, cuite à la vapeur, servie avec un bouillon riche en légumes (carottes, courgettes, navets), pois chiches et un assortiment de viandes tendres : agneau, poulet et merguez. Les épices comme le ras el-hanout, le cumin et le paprika apportent une saveur unique. Ce plat est souvent dégusté lors des grandes occasions familiales et des fêtes, accompagné de raisins secs ou de harissa pour relever le goût.',
      pays: 'Algérie',
      type: 'Plat principal'
    },
    {
      nom: 'Tajine de Poulet',
      prix: 16.00,
      note: 4.5,
      image: '/src/assets/img/cuisine-mar/tajine-poulet-citron.jpeg',
      short_desc: 'Poulet mijoté lentement avec des olives vertes, des citrons confits, des oignons fondants et un mélange d\'épices marocaines, offrant une explosion de saveurs sucrées-salées.',
      long_desc: 'Le tajine de poulet est un incontournable de la cuisine marocaine, où le poulet est cuit à feu doux dans un plat en terre cuite, avec des olives vertes, des citrons confits, des oignons caramélisés et un mélange d\'épices (gingembre, curcuma, safran, coriandre). Ce mode de cuisson permet d\'obtenir une viande tendre et parfumée, imprégnée des arômes subtils des ingrédients. Servi avec du pain marocain ou de la semoule, ce plat séduit par son équilibre entre acidité, douceur et épices, et incarne l\'hospitalité marocaine.',
      pays: 'Maroc',
      type: 'Plat principal'
    },
    {
      nom: 'Makroud',
      prix: 5.00,
      note: 4.2,
      image: '/src/assets/img/cuisine-tun/makroudh.jpeg',
      short_desc: 'Délicieuse pâtisserie maghrébine à base de semoule dorée, fourrée d\'une pâte de dattes parfumée à la fleur d\'oranger, puis frite ou cuite au four et enrobée de miel.',
      long_desc: 'Le makroud est une pâtisserie traditionnelle du Maghreb, très appréciée pour sa texture fondante et son goût sucré. Il est confectionné à partir de semoule de blé, travaillée avec du beurre et de l\'eau de fleur d\'oranger, puis garnie d\'une pâte de dattes moelleuse parfumée à la cannelle. Les makrouds sont ensuite façonnés en losanges, frits ou cuits au four, puis généreusement trempés dans du miel chaud. Cette douceur est souvent servie lors des fêtes religieuses ou des grandes occasions, accompagnée d\'un thé à la menthe.',
      pays: 'Tunisie',
      type: 'Dessert'
    },
    {
      nom: 'Bricks à l\'œuf',
      prix: 7.00,
      note: 4.7,
      image: '/src/assets/img/cuisine-tun/brik-oeuf.jpeg',
      short_desc: 'Feuilleté croustillant à base de feuille de brick, garni d\'un œuf coulant, de thon, de câpres et de persil, frit à la perfection pour une entrée gourmande et savoureuse.',
      long_desc: 'La brick à l\'œuf est une spécialité tunisienne incontournable, composée d\'une fine feuille de brick enveloppant un œuf frais, souvent accompagné de thon émietté, de pommes de terre, de câpres, de persil et d\'épices. Le tout est plié en triangle ou en rouleau, puis frit jusqu\'à obtenir une texture dorée et croustillante, tandis que l\'œuf reste coulant à l\'intérieur. Ce mets est servi chaud, généralement en entrée, et apprécié pour son contraste de textures et ses saveurs délicates. Il est souvent dégusté pendant le Ramadan ou lors de repas festifs.',
      pays: 'Tunisie',
      type: 'Entrée'
    }
  ],

  evenements: [
    {
      title: "Soirée Couscous & Musique Andalouse",
      date: "2025-07-15T20:00:00",
      lieu: "Paris",
      image: "/img/events/couscous-iftar.jpeg",
      description: "Participez à une soirée festive avec un délicieux couscous accompagné de musique andalouse en live.",
      short_desc: "Couscous et musique andalouse à Paris.",
      long_desc: "Rejoignez-nous pour une soirée exceptionnelle où la gastronomie maghrébine rencontre la musique andalouse. Profitez d'un couscous traditionnel et laissez-vous emporter par les rythmes envoûtants d'artistes talentueux. Une expérience conviviale à ne pas manquer !",
      places_total: 50,
      places_restantes: 18,
      prix_par_personne: 30.00
    },
    {
      title: "Buffet spécial Ramadan",
      date: "2025-07-20T18:00:00",
      lieu: "Paris",
      image: "/img/events/ramadan-event.jpeg",
      description: "Un buffet généreux aux saveurs maghrébines pour célébrer le mois sacré en communauté.",
      short_desc: "Buffet maghrébin pour Ramadan à Paris.",
      long_desc: "Venez partager un moment chaleureux autour d'un buffet riche en spécialités maghrébines. Célébrez le Ramadan dans une ambiance familiale et découvrez des plats authentiques préparés avec soin pour l'occasion.",
      places_total: 80,
      places_restantes: 35,
      prix_par_personne: 40.00
    }
  ]
};

const seedDatabase = async () => {
  try {
    console.log('Début remplissage bdd');

    await query('SET FOREIGN_KEY_CHECKS = 0');
    await query('TRUNCATE TABLE avis');
    await query('TRUNCATE TABLE items_commande');
    await query('TRUNCATE TABLE commandes');
    await query('TRUNCATE TABLE reservations');
    await query('TRUNCATE TABLE evenements');
    await query('TRUNCATE TABLE plats');
    await query('TRUNCATE TABLE articles');
    await query('TRUNCATE TABLE utilisateurs');
    await query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Insertion des users');
    for (const user of seedData.utilisateurs) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await query(
        'INSERT INTO utilisateurs (prenom, nom, email, password, telephone, adresse, code_postal, statut, role, date_inscription) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [user.prenom, user.nom, user.email, hashedPassword, user.telephone, user.adresse, user.code_postal, user.statut, user.role]
      );
    }

    console.log('Insertion des article');
    for (const article of seedData.articles) {
      await query(
        'INSERT INTO articles (title, slug, excerpt, content, image, category) VALUES (?, ?, ?, ?, ?, ?)',
        [article.title, article.slug, article.excerpt, article.content, article.image, article.category]
      );
    }

    console.log('Insertion plats');
    for (const plat of seedData.plats) {
      await query(
        'INSERT INTO plats (nom, prix, note, image, short_desc, long_desc, pays, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [plat.nom, plat.prix, plat.note, plat.image, plat.short_desc, plat.long_desc, plat.pays, plat.type]
      );
    }

    console.log('Insertion events');
    for (const evenement of seedData.evenements) {
      await query(
        'INSERT INTO evenements (title, date, lieu, image, description, short_desc, long_desc, places_total, places_restantes, prix_par_personne) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [evenement.title, evenement.date, evenement.lieu, evenement.image, evenement.description, evenement.short_desc, evenement.long_desc, evenement.places_total, evenement.places_restantes, evenement.prix_par_personne]
      );
    }

    console.log('ok');

  } catch (error) {
    console.error('erreur:', error.message);
    throw error;
  }
};

if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Base de données ok remplie !');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Erreur remplissage:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
