# 🚀 Installation du Backend PKHeX

Ce guide explique comment installer et démarrer le backend Node.js qui utilise PKHeX.Core pour parser les saves Pokémon Gen 1-9.

## ⚡ Installation Rapide

### 1. Installer Node.js
Télécharger et installer Node.js 18+ depuis : https://nodejs.org/

### 2. Installer .NET SDK
Télécharger et installer .NET SDK 7.0+ depuis : https://dotnet.microsoft.com/download

### 3. Installer les dépendances

```bash
cd backend
npm install
```

### 4. Installer dotnet-script

```bash
dotnet tool install -g dotnet-script
```

### 5. Télécharger PKHeX.Core

```bash
cd backend
dotnet add package PKHeX.Core
```

Ou créer un fichier `backend/backend.csproj` :

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net7.0</TargetFramework>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="PKHeX.Core" Version="23.11.24" />
  </ItemGroup>
</Project>
```

Puis :
```bash
dotnet restore
```

## 🎮 Démarrage

### Démarrer le backend

```bash
cd backend
npm start
```

Le serveur démarre sur `http://localhost:3000`

### Tester que ça fonctionne

```bash
curl http://localhost:3000/api/health
```

Devrait retourner :
```json
{
  "status": "ok",
  "message": "GenLock Backend API is running"
}
```

### Démarrer le frontend

Ouvrir `index.html` dans un navigateur (ou utiliser Live Server dans VS Code).

## 📊 Utilisation

1. **Démarrer le backend** : `cd backend && npm start`
2. **Ouvrir le frontend** : Ouvrir `index.html`
3. **Importer une save** : Cliquer sur "📥 Importer Save"
4. **Le frontend essaiera automatiquement** :
   - ✅ Backend API (PKHeX.Core) en premier → Support Gen 1-9 complet
   - ⚠️ Fallback sur JS parser si backend indisponible → Gen 1-2 seulement

## 🔧 Dépannage

### Le backend ne démarre pas

**Erreur : `dotnet-script` not found**
```bash
dotnet tool install -g dotnet-script
# Puis redémarrer le terminal
```

**Erreur : PKHeX.Core not found**
```bash
cd backend
dotnet add package PKHeX.Core
```

### Le frontend ne se connecte pas au backend

1. Vérifier que le backend tourne : `curl http://localhost:3000/api/health`
2. Vérifier la console du navigateur (F12)
3. Vérifier que CORS est activé (déjà fait dans `server.js`)

### Alternative : Utiliser un exe compilé

Si `dotnet-script` ne fonctionne pas, créer un projet C# console :

```bash
cd backend
mkdir pkhex-cli
cd pkhex-cli
dotnet new console
dotnet add package PKHeX.Core
```

Puis compiler en exe et l'appeler depuis Node.js.

## 📝 Architecture

```
Frontend (HTML/JS)
    ↓
BackendAPI.parseSave(file)
    ↓
Node.js Express Server (port 3000)
    ↓
dotnet-script pkhex-parser.csx
    ↓
PKHeX.Core (C#)
    ↓
JSON Response
```

## ✅ Avantages du Backend

- ✅ Support Gen 1-9 complet (y compris Scarlet/Violet)
- ✅ Toutes les données : IVs, EVs, nature, capacités, ruban, etc.
- ✅ Validation de légalité
- ✅ Checksums corrects
- ✅ Même logique que PKHeX officiel

## 🎯 Prochaines étapes

1. Tester avec des saves de toutes les générations
2. Ajouter plus de données (badges, Pokédex complet, objets)
3. Ajouter un cache pour éviter de re-parser les mêmes saves
4. Déployer le backend sur un serveur (Heroku, Railway, etc.)
