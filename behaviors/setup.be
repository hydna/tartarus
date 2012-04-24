ROOM_CHANNEL = 50
HANDSHAKE_CHANNEL = 2
NUMBER_OF_ROOMS = 40
LAST_CHANNEL = ROOM_CHANNEL + NUMBER_OF_ROOMS;


SCRIPT_ENV = {
  ROOM_CHANNEL:     ROOM_CHANNEL,
  NUMBER_OF_ROOMS:  NUMBER_OF_ROOMS,
  MAX_USERS:        50
}


open

  channel = HANDSHAKE_CHANNEL
    run("./onhandshake.js", SCRIPT_ENV)
    when = $CODE
      redirect($CODE, $MESSAGE)
    end
    deny($MESSAGE)
  end

  for (var INDEX = 0; INDEX < NUMBER_OF_ROOMS; INDEX++) {
  channel = ROOM_CHANNEL + INDEX
    deny("ERR_OPEN_VIA_HANDSHAKE")
  end
  }

end


close

  for (var INDEX = 0; INDEX < NUMBER_OF_ROOMS; INDEX++) {
  channel = ROOM_CHANNEL + INDEX
    run("./onclose.js", SCRIPT_ENV)
  end
  }

end


emit

  for (var INDEX = 0; INDEX < NUMBER_OF_ROOMS; INDEX++) {
  channel = ROOM_CHANNEL + INDEX
    token = "get_user_list"
      run("./api_get_user_list.js")
    end
  end
  }

end