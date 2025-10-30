# 🎮 GenLock Tracker - Pokémon Challenge

Une application web moderne et intuitive pour suivre votre défi GenLock Pokémon !

## 📋 Qu'est-ce que le GenLock ?

Le **GenLock** (ou Generation Locke) est un défi Pokémon où vous jouez plusieurs jeux simultanément avec des règles de synchronisation :

- **Règle principale** : Si un Pokémon meurt dans un jeu, il doit être retiré de TOUS les jeux
- Vous progressez à travers plusieurs générations de jeux Pokémon
- Chaque jeu a ses propres champions actifs, mais partage les morts avec les autres

## ✨ Fonctionnalités

### 🎯 Interface intuitive
- **Drag & Drop** : Déplacez vos Pokémon entre les sections en les glissant
- **Ajout rapide** : Tapez le nom et appuyez sur Entrée
- **Design moderne** : Interface colorée inspirée de l'univers Pokémon

### 🎮 Gestion multi-jeux
- Ajoutez autant de jeux que vous voulez
- Personnalisez chaque jeu avec un nom et une image
- Trois sections par jeu :
  - 🏆 **Champions** : Votre équipe active
  - 📦 **Retraités** : Pokémon mis de côté
  - 💀 **Morts** : Pokémon KO (synchronisés entre tous les jeux)

### 💾 Sauvegarde et partage
- **LocalStorage** : Vos données sont sauvegardées automatiquement dans le navigateur
- **Export/Import JSON** : Sauvegardez vos données en fichier JSON
- **Export Image** : Générez une belle image de vos équipes à partager avec vos amis !
- **Import Save ROM** : Importez directement vos équipes depuis vos fichiers .sav (Gen 1)
- **Backup** : Exportez régulièrement pour ne jamais perdre votre progression

### 📊 Statistiques en temps réel
- Nombre total de jeux
- Total de champions actifs
- Total de Pokémon retraités
- Total de Pokémon morts

## 🚀 Installation et utilisation

### Méthode 1 : Utilisation locale (recommandée)

1. **Téléchargez les fichiers** dans un dossier
2. **Double-cliquez** sur `index.html`
3. L'application s'ouvre dans votre navigateur !

### Méthode 2 : Serveur local

```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (npx)
npx serve

# Avec PHP
php -S localhost:8000
```

Puis ouvrez `http://localhost:8000` dans votre navigateur.

## 📖 Guide d'utilisation

### Ajouter un jeu

1. Cliquez sur **"➕ Ajouter un jeu"**
2. Entrez le nom du jeu (ex: "Pokémon Rouge")
3. (Optionnel) Ajoutez l'URL d'une image de la jaquette
4. Cliquez sur **"Ajouter"**

### Gérer vos Pokémon

#### Ajouter un Pokémon
- Tapez le nom dans le champ sous chaque section
- Appuyez sur **Entrée** ou cliquez sur **"+"**

#### Déplacer un Pokémon
- **Cliquez et maintenez** sur un Pokémon
- **Glissez-le** vers une autre section
- **Relâchez** pour le déposer

#### Supprimer un Pokémon
- Cliquez sur le **"×"** à droite du nom du Pokémon

### Règle spéciale : Section "Morts"

⚠️ **Important** : Quand vous déplacez un Pokémon vers la section "💀 Morts", il est **automatiquement ajouté à la section Morts de TOUS les jeux** et retiré des Champions/Retraités partout.

C'est la règle fondamentale du GenLock !

### Sauvegarder vos données

#### Sauvegarde automatique
- Vos données sont **automatiquement sauvegardées** à chaque modification
- Elles restent dans votre navigateur même après fermeture

#### Export manuel
1. Cliquez sur **"📤 Exporter"**
2. Un fichier JSON est téléchargé avec la date
3. Conservez ce fichier en backup !

#### Import
1. Cliquez sur **"📥 Importer"**
2. Sélectionnez votre fichier JSON
3. Confirmez le remplacement des données

### Réinitialiser

⚠️ **Attention** : Cette action est irréversible !

1. Cliquez sur **"🔄 Réinitialiser"**
2. Confirmez deux fois
3. Toutes les données sont effacées

## 💡 Conseils et astuces

### Organisation recommandée

1. **Ordre chronologique** : Ajoutez vos jeux dans l'ordre des générations
2. **Images** : Utilisez des URLs d'images pour identifier rapidement vos jeux
3. **Noms clairs** : Utilisez des surnoms mémorables pour vos Pokémon

### Bonnes pratiques

- ✅ **Exportez régulièrement** vos données (après chaque session)
- ✅ **Vérifiez les morts** dans tous les jeux avant de continuer
- ✅ **Utilisez le drag & drop** pour gagner du temps
- ✅ **Sauvegardez avant de réinitialiser** (export JSON)

### Raccourcis clavier

- **Entrée** : Ajouter un Pokémon après avoir tapé son nom
- **Tab** : Naviguer entre les champs de saisie

## 🎨 Personnalisation

### Modifier les couleurs

Éditez le fichier `index.html` et modifiez les couleurs dans la section `<style>` :

```css
/* Couleur principale */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Sections */
.champions { background: #fff3bf; } /* Jaune */
.retired { background: #ffe0b2; }   /* Orange */
.dead { background: #ffcdd2; }      /* Rouge */
```

### Ajouter des fonctionnalités

Le code est organisé en fonctions claires dans `app.js` :
- `addGame()` : Ajouter un jeu
- `addPokemon()` : Ajouter un Pokémon
- `handleDrop()` : Logique du drag & drop
- `saveData()` : Sauvegarde
- etc.

## 🔧 Structure des fichiers

```
genlockformat/
├── index.html          # Interface utilisateur
├── app.js             # Logique de l'application
└── README.md          # Ce fichier
```

## 📱 Compatibilité

- ✅ Chrome / Edge (recommandé)
- ✅ Firefox
- ✅ Safari
- ✅ Responsive (mobile & tablette)

## 🐛 Problèmes connus

### Les données ne se sauvegardent pas
- Vérifiez que les cookies/localStorage sont activés
- Essayez un autre navigateur
- Utilisez l'export/import manuel

### Le drag & drop ne fonctionne pas
- Assurez-vous d'utiliser un navigateur récent
- Sur mobile, utilisez les boutons d'ajout/suppression

## 📝 Format des données

Les données sont stockées au format JSON :

```json
[
  {
    "id": 1234567890,
    "name": "Pokémon Rouge",
    "image": "https://...",
    "champions": [
      { "id": 1234567891, "name": "Pikachu" }
    ],
    "retired": [],
    "dead": []
  }
]
```

## 🤝 Contribution

N'hésitez pas à :
- Signaler des bugs
- Proposer des améliorations
- Partager vos idées de fonctionnalités

## 📜 Licence

Ce projet est libre d'utilisation pour votre usage personnel.

---

**Bon courage pour votre défi GenLock ! 🎮⚡**

*Attrapez-les tous... sans les perdre !*
