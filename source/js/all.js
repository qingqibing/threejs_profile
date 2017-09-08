let scene,
    renderer,
    camera,
    light;

let pic;

let width,
    height;

let raycaster,
    mouse,
    control;

const init = () => {
    window.addEventListener('resize', onResize, false);

    width = window.innerWidth;
    height = window.innerHeight - 20;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.getElementById('main').appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.set(0, 0, 2);
    scene.add(camera);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 10, 0);
    // light.castShadow = true;
    scene.add(light);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    control = new THREE.OrbitControls(camera, renderer.domElement);

    renderContent();
    renderSkybox();
    animate();

    window.addEventListener('click', onClick, false);
};

const renderContent = () => {
    const picGeom = new THREE.PlaneGeometry(1, 1);
    const picMat = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('./assets/img/david.jpg')
    });

    pic = new THREE.Mesh(picGeom, picMat);
    pic.position.set(0, 0, -4);
    pic.name = 'david';
    scene.add(pic);

    const planeGeom = new THREE.PlaneGeometry(7, 7);
    const planeMat = new THREE.MeshPhongMaterial({ color: 0xdddddd, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeom, planeMat);
    plane.rotation.x = Math.PI / 2;
    plane.position.z = -1;
    plane.position.y = -1;
    scene.add(plane);

    const fontLoader = new THREE.FontLoader();
    fontLoader.load('./assets/fonts/helvetiker_bold.typeface.json', (font) => {
        const fontGeom = new THREE.TextGeometry('David', {
            font,
            size: .8,
            height: .2,

        });
        const fontFront = new THREE.MeshBasicMaterial({
            color: 0xff0000
        });
        const fontSide = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });

        const fontMesh = new THREE.Mesh(fontGeom, [fontFront, fontSide]);
        fontMesh.position.set(-1.5, 1, -4);
        scene.add(fontMesh);

        fontGeom.computeBoundingBox();
        fontGeom.textWidth = 1;
    });

    const objLoader = new THREE.OBJLoader();
    objLoader.load('./assets/obj/davidprint.obj', (mesh) => {
        mesh.scale.set(.02, .02, .02);
        mesh.position.set(-2.5, -1, -4);
       scene.add(mesh);
    });
};

const renderSkybox = () => {
    const skyboxGeom = new THREE.CubeGeometry(100, 100, 100);
    const skyboxMat = [
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('./assets/skybox/ft.png'),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('./assets/skybox/bk.png'),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('./assets/skybox/up.png'),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('./assets/skybox/dn.png'),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('./assets/skybox/rt.png'),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('./assets/skybox/lf.png'),
            side: THREE.DoubleSide
        }),
    ];

    const skybox = new THREE.Mesh(skyboxGeom, skyboxMat);
    scene.add(skybox);
};


const onResize = () => {
    width = window.innerWidth;
    height = window.innerHeight - 20;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
};

const animate = () => {
    requestAnimationFrame(animate);
    render();
};

const onClick = (e) => {
    e.preventDefault();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    console.log(mouse);
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects([pic]);
    if (intersects.length > 0) {
        console.log(intersects[0]);
        intersects[0].object.position.z -= 1;
    }
};

const render = () => {
    renderer.render(scene, camera)
};


window.onload = init;