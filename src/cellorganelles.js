import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

document.addEventListener("DOMContentLoaded", () => {
    initNucleus();
    initMitochondria();
    initER();
    initGolgi();
    initLysosomes();
    initVacuoles();
    setupTabs();
});

function setupTabs() {
    const buttons = document.querySelectorAll("#cell_bar button");
    const containers = document.querySelectorAll(".codia");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            containers.forEach(c => c.classList.remove("active"));

            btn.classList.add("active");
            const targetId = btn.id.replace("btn_", "") + "_dia";
            const targetContainer = document.getElementById(targetId);
            if (targetContainer) {
                targetContainer.classList.add("active");
                window.dispatchEvent(new Event('resize'));
            }
        });
    });
    if(buttons[0]) buttons[0].classList.add("active");
}

function initNucleus() {
    var container = document.getElementById('nucleus_dia');
    if (!container) return;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010103);
    scene.fog = new THREE.FogExp2(0x010103, 0.12);

    var camera = new THREE.PerspectiveCamera(30, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(3, 4, 8);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth - 16, container.clientHeight - 16);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 0.8;
    controls.maxDistance = 12;

    var ambientLight = new THREE.AmbientLight(0x0d071a, 3.0);
    scene.add(ambientLight);

    var light1 = new THREE.DirectionalLight(0xd8b4fe, 6.0);
    light1.position.set(5, 7, 4);
    scene.add(light1);

    var light2 = new THREE.DirectionalLight(0x00ffff, 2.5);
    light2.position.set(-5, -3, -2);
    scene.add(light2);

    var innerGlowLight = new THREE.PointLight(0xbd66ff, 4.0, 4.0);
    innerGlowLight.position.set(0, 0, 0);
    scene.add(innerGlowLight);

    var nucleusGroup = new THREE.Group();
    scene.add(nucleusGroup);

    var envelopeGeo = new THREE.SphereGeometry(2, 64, 64);
    var envelopeMat = new THREE.MeshStandardMaterial({
        color: 0x2e085c,
        emissive: 0x070114,
        roughness: 0.4,
        metalness: 0.1,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide
    });
    var nuclearEnvelope = new THREE.Mesh(envelopeGeo, envelopeMat);
    nucleusGroup.add(nuclearEnvelope);

    var fluidGeo = new THREE.SphereGeometry(1.92, 64, 64);
    var fluidMat = new THREE.MeshStandardMaterial({
        color: 0x411175,
        emissive: 0x130226,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
    });
    var nucleoplasmFluid = new THREE.Mesh(fluidGeo, fluidMat);
    nucleusGroup.add(nucleoplasmFluid);

    var coreGroup = new THREE.Group();
    nucleusGroup.add(coreGroup);

    var nucleolusGeo = new THREE.SphereGeometry(0.55, 64, 64);
    var nucleolusMat = new THREE.MeshStandardMaterial({
        color: 0x8a00c2,
        emissive: 0x2d0044,
        roughness: 0.6,
        metalness: 0.2,
        flatShading: true
    });
    var nucleolus = new THREE.Mesh(nucleolusGeo, nucleolusMat);
    coreGroup.add(nucleolus);

    var strandsGroup = new THREE.Group();
    coreGroup.add(strandsGroup);

    var strandCount = 28;
    var pointsPerStrand = 24;
    var strandCurves = [];

    for (let s = 0; s < strandCount; s++) {
        var points = [];
        var phiStart = Math.random() * Math.PI;
        var thetaStart = Math.random() * Math.PI * 2;
        
        for (let p = 0; p < pointsPerStrand; p++) {
            var t = p / (pointsPerStrand - 1);
            var phi = phiStart + (Math.random() - 0.5) * 0.5;
            var theta = thetaStart + t * Math.PI * 1.2;
            var r = 0.6 + t * 0.5 + Math.sin(t * Math.PI) * 0.12;

            var x = r * Math.sin(phi) * Math.cos(theta);
            var y = r * Math.sin(phi) * Math.sin(theta);
            var z = r * Math.cos(phi);
            points.push(new THREE.Vector3(x, y, z));
        }

        var curve = new THREE.CatmullRomCurve3(points);
        var tubeGeo = new THREE.TubeGeometry(curve, 32, 0.012, 6, false);
        var tubeMat = new THREE.MeshStandardMaterial({
            color: 0xf3e8ff,
            emissive: 0x3b0b5a,
            roughness: 0.2,
            transparent: true,
            opacity: 0.9
        });
        
        var strandMesh = new THREE.Mesh(tubeGeo, tubeMat);
        strandsGroup.add(strandMesh);
        
        strandCurves.push({
            mesh: strandMesh,
            basePoints: points,
            speed: 0.8 + Math.random() * 1.4,
            phase: Math.random() * Math.PI
        });
    }

    var particulateCount = 80;
    var particulateGeo = new THREE.BufferGeometry();
    var particulatePositions = new Float32Array(particulateCount * 3);

    for (let i = 0; i < particulateCount * 3; i += 3) {
        var u = Math.random();
        var th = Math.random() * Math.PI * 2;
        var ph = Math.acos(2 * Math.random() - 1);
        var r = 0.6 + u * 1.2;

        particulatePositions[i] = r * Math.sin(ph) * Math.cos(th);
        particulatePositions[i + 1] = r * Math.sin(ph) * Math.sin(th);
        particulatePositions[i + 2] = r * Math.cos(ph);
    }

    particulateGeo.setAttribute('position', new THREE.BufferAttribute(particulatePositions, 3));
    var particulateMat = new THREE.PointsMaterial({
        color: 0xe9d5ff,
        size: 0.025,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    var particulates = new THREE.Points(particulateGeo, particulateMat);
    coreGroup.add(particulates);

    function animationLoop(t) {
        nucleusGroup.rotation.y = t / 6000;
        
        var posAttribute = fluidGeo.attributes.position;
        var timeFactor = t / 300;
        for (let i = 0; i < posAttribute.count; i++) {
            var x = posAttribute.getX(i);
            var y = posAttribute.getY(i);
            var z = posAttribute.getZ(i);
            
            var wave = Math.sin(x * 2.5 + timeFactor) * 0.035 + Math.cos(y * 2.5 + timeFactor) * 0.035;
            var vector = new THREE.Vector3(x, y, z).normalize().multiplyScalar(1.92 + wave);
            posAttribute.setXYZ(i, vector.x, vector.y, vector.z);
        }
        fluidGeo.computeVertexNormals();
        posAttribute.needsUpdate = true;

        for (let s = 0; s < strandCurves.length; s++) {
            var sc = strandCurves[s];
            var dynamicPoints = [];
            var offsetTime = (t / 1000) * sc.speed + sc.phase;

            for (let p = 0; p < pointsPerStrand; p++) {
                var bp = sc.basePoints[p];
                var shift = Math.sin(p * 0.4 + offsetTime) * 0.025;
                
                dynamicPoints.push(new THREE.Vector3(
                    bp.x + shift,
                    bp.y + Math.cos(p * 0.4 + offsetTime) * 0.025,
                    bp.z + shift
                ));
            }
            
            var newCurve = new THREE.CatmullRomCurve3(dynamicPoints);
            sc.mesh.geometry.dispose();
            sc.mesh.geometry = new THREE.TubeGeometry(newCurve, 32, 0.012, 6, false);
        }

        coreGroup.rotation.x = Math.sin(t / 4000) * 0.04;
        coreGroup.rotation.z = Math.cos(t / 4500) * 0.04;

        controls.update();
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animationLoop);

    window.addEventListener('resize', () => {
        if (container.clientWidth > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth - 16, container.clientHeight - 16);
        }
    });
}

function initMitochondria() {
    var container = document.getElementById('mitochondria_dia');
    if (!container) return;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010103);
    scene.fog = new THREE.FogExp2(0x010103, 0.12);

    var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(5, 5, 9);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(1, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 1;
    controls.maxDistance = 15;

    var ambientLight = new THREE.AmbientLight(0x0a101d, 3.0);
    scene.add(ambientLight);

    var light1 = new THREE.DirectionalLight(0xffa6c9, 5.0);
    light1.position.set(6, 6, 4);
    scene.add(light1);

    var light2 = new THREE.DirectionalLight(0x00aaff, 3.0);
    light2.position.set(-6, -4, -3);
    scene.add(light2);

    var mitoGroup = new THREE.Group();
    scene.add(mitoGroup);

    var outerGeo = new THREE.CapsuleGeometry(1.2, 2.2, 32, 64);
    var outerMat = new THREE.MeshStandardMaterial({
        color: 0x991b1b,
        emissive: 0x220505,
        roughness: 0.4,
        metalness: 0.1,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide
    });
    var outerMembrane = new THREE.Mesh(outerGeo, outerMat);
    mitoGroup.add(outerMembrane);

    var innerGroup = new THREE.Group();
    mitoGroup.add(innerGroup);

    var cristaeCount = 14;
    var cristaeMeshes = [];
    
    for (let i = 0; i < cristaeCount; i++) {
        var pct = i / (cristaeCount - 1);
        var yPos = (pct - 0.5) * 2.4;
        var radiusFactor = Math.cos((pct - 0.5) * Math.PI * 0.7) * 0.95;
        
        var cristaShape = new THREE.Shape();
        var steps = 40;
        for (let j = 0; j <= steps; j++) {
            var angle = (j / steps) * Math.PI * 2;
            var r = radiusFactor * (0.8 + Math.sin(angle * 5) * 0.22);
            var x = Math.cos(angle) * r;
            var z = Math.sin(angle) * r;
            if (j === 0) cristaShape.moveTo(x, z);
            else cristaShape.lineTo(x, z);
        }

        var extrudeSettings = { depth: 0.08, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
        var cristaGeo = new THREE.ExtrudeGeometry(cristaShape, extrudeSettings);
        cristaGeo.center();
        
        var cristaMat = new THREE.MeshStandardMaterial({
            color: 0xe11d48,
            emissive: 0x4c0519,
            roughness: 0.4,
            metalness: 0.2,
            side: THREE.DoubleSide
        });
        
        var cristaMesh = new THREE.Mesh(cristaGeo, cristaMat);
        cristaMesh.position.y = yPos;
        cristaMesh.rotation.x = Math.PI / 2;
        cristaMesh.rotation.z = (i * Math.PI / 4);
        
        innerGroup.add(cristaMesh);
        cristaeMeshes.push({
            mesh: cristaMesh,
            baseRotation: cristaMesh.rotation.z,
            phase: i * 0.5
        });
    }

    var riboCount = 25;
    var riboGeo = new THREE.SphereGeometry(0.025, 8, 8);
    var riboMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 });
    for (let i = 0; i < riboCount; i++) {
        var rMesh = new THREE.Mesh(riboGeo, riboMat);
        var t = Math.random() * Math.PI * 2;
        var u = Math.random() + Math.random();
        var r = (u > 1 ? 2 - u : u) * 0.75;
        rMesh.position.set(Math.cos(t) * r, (Math.random() - 0.5) * 1.8, Math.sin(t) * r);
        innerGroup.add(rMesh);
    }

    var dnaGroup = new THREE.Group();
    innerGroup.add(dnaGroup);

    var dnaCount = 4;
    var dnaLoops = [];
    for (let d = 0; d < dnaCount; d++) {
        let loopPoints = [];
        let segments = 32;
        let baseRadius = 0.18 + Math.random() * 0.08;
        
        for (let s = 0; s <= segments; s++) {
            let angle = (s / segments) * Math.PI * 2;
            let waveFactor = 1.0 + Math.sin(angle * 5.0) * 0.15;
            let lx = Math.cos(angle) * baseRadius * waveFactor;
            let lz = Math.sin(angle) * baseRadius * waveFactor;
            loopPoints.push(new THREE.Vector3(lx, 0, lz));
        }

        let dnaCurve = new THREE.CatmullRomCurve3(loopPoints);
        let dnaGeo = new THREE.TubeGeometry(dnaCurve, 40, 0.012, 6, true);
        let dnaMat = new THREE.MeshStandardMaterial({
            color: 0x22c55e,
            emissive: 0x052e16,
            roughness: 0.3,
            transparent: true,
            opacity: 0.95
        });

        let dnaMesh = new THREE.Mesh(dnaGeo, dnaMat);
        
        dnaMesh.position.set(
            (Math.random() - 0.5) * 0.6,
            (Math.random() - 0.5) * 1.4,
            (Math.random() - 0.5) * 0.6
        );
        dnaMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        dnaGroup.add(dnaMesh);
        
        dnaLoops.push({
            mesh: dnaMesh,
            seed: Math.random() * 50,
            speed: 0.5 + Math.random() * 0.8
        });
    }

    function animationLoop(t) {
        mitoGroup.rotation.y = t / 7000;
        mitoGroup.rotation.x = Math.sin(t / 9000) * 0.2;

        for (let i = 0; i < cristaeMeshes.length; i++) {
            var c = cristaeMeshes[i];
            if(!c) continue;
            var scaleWave = 1 + Math.sin(t / 1200 + c.phase) * 0.06;
            c.mesh.scale.set(scaleWave, scaleWave, 1);
            c.mesh.rotation.z = c.baseRotation + Math.cos(t / 2000 + c.phase) * 0.05;
        }

        dnaLoops.forEach(d => {
            d.mesh.rotation.y += 0.005 * d.speed;
            d.mesh.position.y += Math.sin(t / 1000 + d.seed) * 0.0005;
        });

        controls.update();
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animationLoop);

    function resizeMito() {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth - 16, container.clientHeight - 16);
        }
    }

    window.addEventListener('resize', resizeMito);
    resizeMito();
}

function initER() {
    var container = document.getElementById('er_dia');
    if (!container) return;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010103);

    var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(4, 4, 8);

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(1, 1);
    container.appendChild(renderer.domElement);

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    var ambient = new THREE.AmbientLight(0x2d1b18, 3.0);
    scene.add(ambient);

    var dLight = new THREE.DirectionalLight(0xffedd5, 5.0);
    dLight.position.set(5, 8, 4);
    scene.add(dLight);

    var erGroup = new THREE.Group();
    scene.add(erGroup);

    var layerCount = 5;
    var sheets = [];

    for (let l = 0; l < layerCount; l++) {
        let rFactor = 0.6 + (l * 0.35);
        let shape = new THREE.Shape();
        let steps = 60;
        
        for (let j = 0; j <= steps; j++) {
            let angle = (j / steps) * Math.PI * 1.5 - (Math.PI * 0.75);
            let radialDist = rFactor * (1.0 + Math.sin(angle * 4.0) * 0.12);
            let x = Math.cos(angle) * radialDist;
            let z = Math.sin(angle) * radialDist;
            if (j === 0) shape.moveTo(x, z);
            else shape.lineTo(x, z);
        }

        let extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.03, bevelThickness: 0.03 };
        let geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geo.center();

        let mat = new THREE.MeshStandardMaterial({
            color: l % 2 === 0 ? 0xedc4b3 : 0xe8b49f,
            emissive: 0x3d1e14,
            roughness: 0.5,
            metalness: 0.05
        });

        let sheetMesh = new THREE.Mesh(geo, mat);
        sheetMesh.position.y = (l - (layerCount / 2)) * 0.3;
        sheetMesh.rotation.x = Math.PI / 2;
        erGroup.add(sheetMesh);
        sheets.push(sheetMesh);

        for (let r = 0; r < 20; r++) {
            let riboGeo = new THREE.SphereGeometry(0.045, 8, 8);
            let riboMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
            let ribo = new THREE.Mesh(riboGeo, riboMat);
            let edgeAngle = (Math.random() - 0.5) * Math.PI * 1.3;
            let rad = rFactor + 0.04;
            ribo.position.set(Math.cos(edgeAngle) * rad, sheetMesh.position.y + (Math.random() - 0.5) * 0.2, Math.sin(edgeAngle) * rad);
            erGroup.add(ribo);
        }
    }

    function animationLoop(t) {
        erGroup.rotation.y = t / 8000;
        sheets.forEach((sheet, idx) => {
            sheet.position.y = ((idx - (layerCount / 2)) * 0.3) + Math.sin(t / 800 + idx) * 0.02;
        });
        controls.update();
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animationLoop);

    function resizeER() {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth - 16, container.clientHeight - 16);
        }
    }
    window.addEventListener('resize', resizeER);
    resizeER();
}

function initGolgi() {
    var container = document.getElementById('ga_dia');
    if (!container) return;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010103);

    var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(5, 3, 7);

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(1, 1);
    container.appendChild(renderer.domElement);

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    var ambient = new THREE.AmbientLight(0x2e1009, 3.0);
    scene.add(ambient);

    var dLight = new THREE.DirectionalLight(0xf97316, 5.0);
    dLight.position.set(6, 6, 4);
    scene.add(dLight);

    var golgiGroup = new THREE.Group();
    scene.add(golgiGroup);

    var cisternaCount = 6;
    var cisternae = [];

    for (let i = 0; i < cisternaCount; i++) {
        let curveFactor = 1.0 - (i * 0.08);
        let scaleFactor = 1.3 - (i * 0.08);
        let shape = new THREE.Shape();
        let steps = 50;

        for (let j = 0; j <= steps; j++) {
            let angle = (j / steps) * Math.PI - (Math.PI / 2);
            let rad = 1.4 * scaleFactor;
            let x = Math.cos(angle) * rad;
            let z = Math.sin(angle) * rad * curveFactor - (i * 0.15);
            if (j === 0) shape.moveTo(x, z);
            else shape.lineTo(x, z);
        }
        for (let j = steps; j >= 0; j--) {
            let angle = (j / steps) * Math.PI - (Math.PI / 2);
            let rad = 1.15 * scaleFactor;
            let x = Math.cos(angle) * rad;
            let z = Math.sin(angle) * rad * curveFactor - (i * 0.15);
            shape.lineTo(x, z);
        }

        let extrudeSettings = { depth: 0.22, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 };
        let geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geo.center();

        let mat = new THREE.MeshStandardMaterial({
            color: 0xea580c,
            roughness: 0.4,
            metalness: 0.1
        });

        let mesh = new THREE.Mesh(geo, mat);
        mesh.position.x = (i - (cisternaCount / 2)) * 0.32;
        mesh.rotation.y = Math.PI / 2;
        golgiGroup.add(mesh);
        cisternae.push(mesh);
    }

    var vesicles = [];
    var vesGeo = new THREE.SphereGeometry(0.08, 16, 16);
    var vesMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3 });
    for (let v = 0; v < 8; v++) {
        let ves = new THREE.Mesh(vesGeo, vesMat);
        ves.position.set((Math.random() - 0.5) * 2.5, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 2.0);
        golgiGroup.add(ves);
        vesicles.push({ mesh: ves, seed: Math.random() * 100 });
    }

    function animationLoop(t) {
        golgiGroup.rotation.y = t / 7000;
        cisternae.forEach((c, idx) => {
            c.scale.set(1, 1 + Math.sin(t / 1000 + idx) * 0.03, 1);
        });
        vesicles.forEach(v => {
            v.mesh.position.y += Math.sin(t / 600 + v.seed) * 0.004;
            v.mesh.position.z += Math.cos(t / 800 + v.seed) * 0.004;
        });
        controls.update();
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animationLoop);

    function resizeGolgi() {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth - 16, container.clientHeight - 16);
        }
    }
    window.addEventListener('resize', resizeGolgi);
    resizeGolgi();
}

function initLysosomes() {
    var container = document.getElementById('lysosomes_dia');
    if (!container) return;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010103);

    var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(1, 1);
    container.appendChild(renderer.domElement);

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    var ambient = new THREE.AmbientLight(0x450a0a, 3.0);
    scene.add(ambient);

    var dLight = new THREE.DirectionalLight(0xef4444, 6.0);
    dLight.position.set(4, 5, 3);
    scene.add(dLight);

    var pLight = new THREE.PointLight(0xd97706, 5.0, 4.0);
    pLight.position.set(0, 0, 0);
    scene.add(pLight);

    var lysoGroup = new THREE.Group();
    scene.add(lysoGroup);

    var mainSphereGeo = new THREE.SphereGeometry(1.2, 64, 64);
    var mainSphereMat = new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.4,
        metalness: 0.1,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });
    var membrane = new THREE.Mesh(mainSphereGeo, mainSphereMat);
    lysoGroup.add(membrane);

    var enzymeGroup = new THREE.Group();
    lysoGroup.add(enzymeGroup);

    var enzymeCount = 35;
    var enzymes = [];
    var enzGeo = new THREE.SphereGeometry(0.08, 8, 8);
    var enzMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, flatShading: true });

    for (let i = 0; i < enzymeCount; i++) {
        let mesh = new THREE.Mesh(enzGeo, enzMat);
        let u = Math.random();
        let th = Math.random() * Math.PI * 2;
        let ph = Math.acos(2 * Math.random() - 1);
        let r = u * 0.95;

        mesh.position.set(r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph));
        enzymeGroup.add(mesh);
        enzymes.push({ mesh: mesh, velocity: new THREE.Vector3((Math.random()-0.5)*0.01, (Math.random()-0.5)*0.01, (Math.random()-0.5)*0.01) });
    }

    function animationLoop(t) {
        lysoGroup.rotation.y = t / 9000;
        enzymeGroup.rotation.x = t / 12000;

        enzymes.forEach(e => {
            e.mesh.position.add(e.velocity);
            if (e.mesh.position.length() > 0.98) {
                e.velocity.reflect(e.mesh.position.clone().normalize());
            }
        });

        controls.update();
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animationLoop);

    function resizeLysosomes() {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth - 16, container.clientHeight - 16);
        }
    }
    window.addEventListener('resize', resizeLysosomes);
    resizeLysosomes();
}

function initVacuoles() {
    var container = document.getElementById('vacuoles_dia');
    if (!container) return;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010103);

    var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(1, 1);
    container.appendChild(renderer.domElement);

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    var ambient = new THREE.AmbientLight(0x0c4a6e, 3.0);
    scene.add(ambient);

    var dLight = new THREE.DirectionalLight(0x38bdf8, 5.0);
    dLight.position.set(3, 5, 4);
    scene.add(dLight);

    var vacGeo = new THREE.SphereGeometry(1.3, 64, 64);
    var vacMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x0369a1,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
    });
    var vacuoleMesh = new THREE.Mesh(vacGeo, vacMat);
    scene.add(vacuoleMesh);

    function animationLoop(t) {
        var posAttr = vacGeo.attributes.position;
        var timeFactor = t / 400;

        for (let i = 0; i < posAttr.count; i++) {
            let x = posAttr.getX(i);
            let y = posAttr.getY(i);
            let z = posAttr.getZ(i);

            let wave = Math.sin(x * 2.0 + timeFactor) * 0.04 + Math.cos(z * 2.0 + timeFactor) * 0.04;
            let normalVec = new THREE.Vector3(x, y, z).normalize().multiplyScalar(1.3 + wave);
            posAttr.setXYZ(i, normalVec.x, normalVec.y, normalVec.z);
        }
        vacGeo.computeVertexNormals();
        posAttr.needsUpdate = true;

        vacuoleMesh.rotation.y = t / 12000;

        controls.update();
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animationLoop);

    function resizeVacuoles() {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth - 16, container.clientHeight - 16);
        }
    }
    window.addEventListener('resize', resizeVacuoles);
    resizeVacuoles();
}