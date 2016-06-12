class SceneManager

  instance = null

  class PrivateClass
    constructor: () ->
      @scenes = []
      @index = 0

    addScene: (scene) ->
      @scenes.push scene

    setScene: (i) ->
      initY = @scenes[0].player.baseLevel
      @scenes[0].player.position.set 0, initY, 0
      @scenes[1].player.position.set 0, initY, 0
      @scenes[2].player.position.set 0, initY, 0
      @scenes[3].player.position.set 0, initY, 0
      @scenes[4].player.position.set 0, initY, 0
      @scenes[5].player.position.set 0, 2, 0
      @scenes[6].player.position.set 0, initY, 0

      for audio in document.getElementsByTagName("audio")
        audio.pause()

      audio = document.getElementsByTagName("audio")[i]
      audio.play()

      @index = i

    isEmpty: ->
      @scenes.length == 0

    scene: ->
      @scenes[@index]

    tick: (delta, now) ->
      @scene().tick(delta, now)

  @get: () ->
    instance ?= new PrivateClass()
