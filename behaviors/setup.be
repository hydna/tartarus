ROOM_CHANNEL = 50
HANDSHAKE_CHANNEL = 2
NUMBER_OF_ROOMS = 4
LAST_CHANNEL = ROOM_CHANNEL + NUMBER_OF_ROOMS;


namespace = "tartarus"

  for (var INDEX = ROOM_CHANNEL; INDEX < LAST_CHANNEL; INDEX++) {
  cache = "room" + INDEX
    max = 100
    size = 20
  end
  }

  script = "api"
    path = "./api.js"
    env = {
      ROOM_CHANNEL: ROOM_CHANNEL,
      NUMBER_OF_ROOMS: NUMBER_OF_ROOMS
    }
  end

end


directive = "open"
  channel = HANDSHAKE_CHANNEL
    run("tartarus:api", ["handshake"])
  end
end


directive = "close"

  for (var INDEX = 0; INDEX < NUMBER_OF_ROOMS; INDEX++) {
  channel = ROOM_CHANNEL + INDEX
    run("tartarus:api", ["disconnect"])
  end
  }

end


directive = "emit"

  for (var INDEX = 0; INDEX < NUMBER_OF_ROOMS; INDEX++) {
  channel = ROOM_CHANNEL + INDEX
    token = "get_user_list"
      run("tartarus:api", ["get_user_list"])
    end
  end
  }

end