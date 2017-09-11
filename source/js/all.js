let data;

let scene,
    renderer,
    camera,
    light;

let pic,
    linkLeft,
    table;

let width,
    height;

let raycaster,
    mouse,
    control;

let objLoader,
    mtlLoader;

const init = () => {
    loadData((res) => {
        data = JSON.parse(res);
        console.log(data);
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

        // for click target ლ(ﾟдﾟლ)
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        control = new THREE.OrbitControls(camera, renderer.domElement);

        renderContent();
        renderSkybox();
        animate();

        window.addEventListener('click', onClick, false);
    });
};

const renderContent = () => {
    objLoader = new THREE.OBJLoader();
    mtlLoader = new THREE.MTLLoader();

    const picGeom = new THREE.PlaneGeometry(1, 1);
    const picMat = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('./assets/img/' + data.userImage)
    });

    pic = new THREE.Mesh(picGeom, picMat);
    pic.position.set(0, .17, -4);
    pic.name = 'david';
    scene.add(pic);

    const planeGeom = new THREE.PlaneGeometry(7, 7);
    const planeMat = new THREE.MeshPhongMaterial({ color: 0xdddddd, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeom, planeMat);
    plane.rotation.x = Math.PI / 2;
    plane.position.z = -1;
    plane.position.y = -1;
    scene.add(plane);


    // create profile name (╯-_-)╯
    const fontLoader = new THREE.FontLoader();
    fontLoader.load('./assets/fonts/helvetiker_bold.typeface.json', (font) => {
        const fontGeom = new THREE.TextGeometry(data.name, {
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


    // load David model ╮(╯◇╰)╭
    objLoader.load('./assets/obj/davidprint.obj', (mesh) => {
        mesh.scale.set(.02, .02, .02);
        mesh.position.set(-2.5, -1, -4);
        scene.add(mesh);
    });


    const dLight = new THREE.DirectionalLight(0xffffff, 1, 100);
    dLight.position.set(.5, -1, 0);
    scene.add(dLight);


    linkLeft = new THREE.Mesh(
        new THREE.CircleGeometry(.5, 32),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('./assets/img/' + data.linkLeft.image)
        })
    );
    linkLeft.position.set(-4, 0, -4);
    linkLeft.rotation.y = Math.PI / 6;
    linkLeft.name = 'linkLeft';
    scene.add(linkLeft);


    const shaderMat = new THREE.ShaderMaterial({
        uniforms: {
            "c": { type: "f", value: 1.0 },
            "p": { type: "f", value: 1.4 },
            glowColor: { type: "c", value: new THREE.Color(0xffff00) },
            viewVector: { type: "v3", value: camera.position }
        },
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    const linkLeftGlow = new THREE.Mesh(new THREE.SphereGeometry(.7, 32, 16), shaderMat);
    linkLeftGlow.position.x = linkLeft.position.x;
    linkLeftGlow.position.y = linkLeft.position.y;
    linkLeftGlow.position.z = linkLeft.position.z;
    scene.add(linkLeftGlow);

    const picGlow = new THREE.Mesh(new THREE.SphereGeometry(.8, 32, 16), shaderMat);
    picGlow.position.x = pic.position.x;
    picGlow.position.y = pic.position.y;
    picGlow.position.z = pic.position.z;
    scene.add(picGlow);

    mtlLoader.load('./assets/obj/wooden-coffe-table.mtl', mat => {
        mat.preload();
        objLoader.setMaterials(mat);
        objLoader.load('./assets/obj/wooden-coffe-table.obj', mesh => {
            mesh.scale.set(.5, .5, .5);
            mesh.position.set(0, -1, -4)
            scene.add(mesh);
        })
    })


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
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects([pic, linkLeft]);
    if (intersects.length > 0) {
        console.log(intersects[0].object);
        if (intersects[0].object.name === 'linkLeft') {
            window.open(data.linkLeft.url);
        }
    }
};

const render = () => {
    renderer.render(scene, camera)
};


const loadData = (callback) => {
    const xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', 'config.json', true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == '200') {
            callback(xhr.responseText);
        }
    };
    xhr.send();
};


window.onload = init;