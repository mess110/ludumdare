renderer = new THREE.WebGLRenderer()
renderer.setSize window.innerWidth, window.innerHeight
document.body.appendChild renderer.domElement
renderer.setClearColor "black", 0
renderer.shadowMapEnabled = true

sm = SceneManager.get()

sm.addScene new Level0()
sm.addScene new Level1()
sm.addScene new Level2()
sm.addScene new Level3()
sm.addScene new Level4()
sm.addScene new Level5()
sm.addScene new Level6()
sm.setScene 0

camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.3, 10)
camera.position.set 0, 2, 5
camera.lookAt sm.scene().scene.position

keyboard = new THREEx.KeyboardState()

lastTimeMsec = null
requestAnimationFrame animate = (nowMsec) ->
  requestAnimationFrame animate

  lastTimeMsec = lastTimeMsec or nowMsec - 1000 / 60
  deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
  lastTimeMsec = nowMsec

  if keyboard.pressed("r")
    location.reload()

  sm.tick(deltaMsec / 1000, nowMsec / 1000)
  renderer.render sm.scene().scene, camera
