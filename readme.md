# Dreamlite

## Overview

Dreamlite is an interactive 3D educational simulator for science and mathematics concepts. It visualizes important diagrams and visuals which helps in understanding the concept better.


## Current Modules

### Science Module

The science module includes interactive simulations of cellular organelles.

Nucleus simulation with chromatin level detail and structural animation  
Endoplasmic reticulum with folded membrane networks  
Mitochondria with internal structure and motion  
Golgi apparatus simulation  
Lysosomes simulation  
Vacuoles simulation  
Animal cell full system view  
Plant cell full system view  

Each organelle is implemented as an independent 3D system.

## Mathematics Module

Not implemented yet

Planned ideas include  
3D graph visualization  
Geometry systems  
 

## Screenshots

### Nucleus
![Nucleus](./screenshots/nucleus.png)

### Endoplasmic Reticulum
![Endoplasmic Reticulum](./screenshots/er.png)

### Mitochondria
![Mitochondria](./screenshots/mitochondria.png)

### Animal Cell
![Animal Cell](./screenshots/ac.png)

## How Modules Work

Each organelle is built as a separate JavaScript module

Each module  
Creates its own Three.js scene  
Sets up its own camera and renderer  
Builds geometry and materials  
Runs its own animation loop  
Handles resizing independently  

Modules are imported into a central main file and initialized when needed

## Tech Stack

Three.js
Vanilla JavaScript (ES Modules)
HTML
CSS
Vite

## How to run?

```npm install
npm run dev```

