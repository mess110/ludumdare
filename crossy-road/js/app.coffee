engine = null
config = null
crossScene = null

document.addEventListener 'DOMContentLoaded', ->
  config = Config.get()
  config.fillWindow()
  # config.toggleStats()
  Helper.addCEButton(type: 'fullscreen')
  Helper.addCEButton(type: 'reinit', position: 'bottom-left')
  Utils.orientation('landscape')

  engine = new Engine3D()

  class Entity extends BaseModel
    randomZ: ->
      @mesh.position.x = Helper.random(30) - 15
      # @mesh.position.x += 1 if @mesh.position.x % 2 != 0

    getPosition: ->
      {
        x: Math.floor(@mesh.position.x)
        y: Math.floor(@mesh.position.y)
        z: Math.floor(@mesh.position.z)
      }

  class Player extends Entity
    constructor: ->
      @raycaster = new THREE.Raycaster()
      @leftEdge = new THREE.Vector3(0.5, 0, 0)
      @rightEdge = new THREE.Vector3(-0.5, 0, 0)

      @dead = false
      @moving = false
      @mesh = JsonModelManager.get().clone('chicken')
      @mesh.scale.set 5, 5, 5
      if Math.random() < 0.5
        @setSkin('black_chicken')

      @animate('idle')

    isAllowedMove: (direction, roads) ->
      if direction == 'w'
        for item in roads[2].items
          if item instanceof Obstacle
            if item.mesh.position.x == @getPosition().x
              return false
      if direction == 's'
        for item in roads[0].items
          if item instanceof Obstacle
            if item.mesh.position.x == @getPosition().x
              return false
      if direction == 'a'
        for item in roads[1].items
          if item instanceof Obstacle
            if item.mesh.position.x - 1 == @getPosition().x
              return false
      if direction == 'd'
        for item in roads[1].items
          if item instanceof Obstacle
            if item.mesh.position.x + 1 == @getPosition().x
              return false
      true

    intersects: (item) ->
      pos = @mesh.position
      @raycaster.set(pos, @leftEdge)
      intersectsLeft = @raycaster.intersectObject(item.mesh)
      @raycaster.set(pos, @rightEdge)
      intersectsRight = @raycaster.intersectObject(item.mesh)
      intersectsLeft.any() || intersectsRight.any()

    move: (direction, roads) ->
      return if @moving
      return unless @isAllowedMove(direction, roads)

      @moving = true
      target = @mesh.position.clone()
      switch direction
        when 'w'
          target.z += 1
          @mesh.rotation.y = 0
        when 's'
          target.z -= 1
          @mesh.rotation.y = Math.PI
        when 'a'
          target.x += 1
          @mesh.rotation.y = Math.PI / 2
        when 'd'
          target.x -= 1
          @mesh.rotation.y = -Math.PI / 2

      @stopAnimations()
      @animate('jump', timeScale: 3)
      tween = Helper.tween(
        target: target, mesh: @mesh
        duration: 250
      ).onComplete(=>
        @moving = false
        return if @dead
        @stopAnimations()
        @animate('idle')
      )
      tween.start()

  class Road extends Entity
    constructor: (index) ->
      @items = []
      @type = ['land', 'car'].random()
      @type = 'land' if index == 0
      @mesh = new THREE.Object3D()

      map = if @type == 'land' then 'road-row' else 'road-row-road'
      texture = TextureManager.get().items[map]
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set( 50, 1 )
      @road = Helper.plane(width: 50, height: 1, map: map)

      @road.rotation.set -Math.PI / 2, 0, 0
      @mesh.add @road
      @init(index)

    init: (i) ->
      @mesh.position.z = i
      return if i == 0

      if @type == 'land'
        for j in [0..3]
          @addItem(Obstacle)
      else if @type == 'car'
        @addItem(Car)

    addItem: (klass) ->
      item = new klass()
      item.randomZ()
      @items.push item
      @mesh.add item.mesh

    tick: (tpf) ->
      for item in @items
        item.move(tpf) if item instanceof Car

  class Car extends Entity
    constructor: ->
      @mesh = JsonModelManager.get().clone('car-base')
      @mesh.scale.set 0.8, 0.8, 0.8
      @mesh.rotation.y = -Math.PI / 2
      if Math.random() < 0.5
        @setSkin('car-base-yellow')
      @speed = 5

    move: (tpf) ->
      @mesh.translateZ(tpf * @speed)
      edge = 15
      if @mesh.position.x < -edge
        @mesh.position.x = edge

  class Obstacle extends Entity
    constructor: ->
      type = ['pinetree', 'trunk'].random()
      @mesh = JsonModelManager.get().clone(type)
      if type == 'trunk'
        @mesh.scale.set 0.2, 0.2, 0.2
      if type == 'pinetree'
        @mesh.scale.set 0.5, 0.5, 0.5

  class CrossScene extends BaseScene
    @roads = []

    init: (options) ->
      @cameraOffsetZ = -2
      @roads = []

      startTile = Helper.plane(map: 'start-tile', size: 1)
      startTile.position.set 0, 0.01, 0
      startTile.rotation.set Math.PI / 2, 0, 0
      @scene.add startTile

      # Helper.orbitControls(engine)
      engine.camera.position.set -4, 9, @cameraOffsetZ
      lookAt = Helper.zero.clone()
      lookAt.x = -2
      lookAt.z = 3
      engine.camera.lookAt(lookAt)
      # engine.camera.rotation.y += 0.2

      @scene.add Helper.ambientLight()
      @scene.add Helper.ambientLight()
      @scene.add Helper.ambientLight()

      @light = Helper.light()
      @light.position.set 0, 60, 0
      @scene.add @light

      for i in [-4..17]
        road = new Road(i)
        @roads.push road
        @scene.add road.mesh

      @player = new Player()
      @scene.add @player.mesh

      @score = document.getElementsByClassName('score')[0]

      @hammer = new Hammer(engine.renderer.domElement)
      @hammer.get('swipe').set(direction: Hammer.DIRECTION_ALL)
      @hammer.on 'swipeup', (event) =>
        roads = @getRoadsAround(@player.getPosition().z)
        @player.move('w', roads)
      @hammer.on 'swipedown', (event) =>
        roads = @getRoadsAround(@player.getPosition().z)
        @player.move('s', roads)
      @hammer.on 'swipeleft', (event) =>
        roads = @getRoadsAround(@player.getPosition().z)
        @player.move('a', roads)
      @hammer.on 'swiperight', (event) =>
        roads = @getRoadsAround(@player.getPosition().z)
        @player.move('d', roads)

    getCameraPosition: ->
      Math.floor(engine.camera.position.z + @cameraOffsetZ * -1)

    getPlayerDistance: ->
      Math.floor(@player.mesh.position.z)

    getRoadsAround: (z) ->
      result = []
      for road in @roads
        pos = road.mesh.position.z
        if pos == z || pos - 1 == z || pos + 1 == z
          result.push road
      result

    tick: (tpf) ->
      return unless @player?

      for road in @roads
        road.tick(tpf)

      return if @player.dead

      roads = @getRoadsAround(@player.getPosition().z)

      if @_isDead(roads)
        @hammer.get('swipe').set(enable: false)
        @player.dead = true
        @player.stopAnimations()
        @player.animate('die', loop: false)
        return

      @player.move('w', roads) if @keyboard.pressed('w')
      @player.move('s', roads) if @keyboard.pressed('s')
      @player.move('a', roads) if @keyboard.pressed('a')
      @player.move('d', roads) if @keyboard.pressed('d')

      if @player.mesh.position.z > engine.camera.position.z + (@cameraOffsetZ * -1)
        engine.camera.position.z += tpf

      @_setScore()
      @_infiniteRoad()

    _setScore: () ->
      @score.innerHTML = @player.getPosition().z

    _isDead: (roads) ->
      for road in roads
        for item in road.items
          if item instanceof Car
            if @player.intersects(item)
              return true
      return false

    _infiniteRoad: ->
      for road in @roads
        if road.mesh.position.z + 4 < Math.floor(engine.camera.position.z)
          road.mesh.position.z = @roads.last().mesh.position.z + 1
      @roads = @roads.sort (a, b) -> a.mesh.position.z - b.mesh.position.z

    doMouseEvent: (event, raycaster) ->

    doKeyboardEvent: (event) ->

  crossScene = new CrossScene()
  SceneManager.get().addScene(crossScene)

  Engine3D.scenify(->
    engine.initScene(crossScene)
  )

  engine.render()
  return
