/**
 * 卡片数据
 * 将JSON数据转换为JS以避免CORS问题
 */
const CARDS_DATA = {
  "cards": [
    {
      "id": "mem_001",
      "title": "1-8am-coffee",
      "type": "memory",
      "year": 1945,
      "time": "8am",
      "unlock_clue": "coffee",
      "new_clues": [
        "toast",
        "badge"
      ],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "The morning sun spills through the window. The cup in my hand is still warm. The coffee is almost at my lips.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "“Gregor.”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "My father's voice stops me. He slides a photograph to the middle of the table.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": ""Your assignment is to bring this woman in." He taps the photo once. "The General says she stole state secrets."",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I sit down the cup and pick up the photograph. My father is a gendarmerie captain; I'm a gendarme. As a soldier, my duty is to obey.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I look at him. There's something in his eyes beyond the order, but all he says is, “Don't disappoint me.”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The ",
          "style": "default"
        },
        {
          "text": "badge",
          "style": "clue"
        },
        {
          "text": " on his chest catches the light—a pledge to the General.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I leave the house. The corner bakery smells of ",
          "style": "default"
        },
        {
          "text": "toast",
          "style": "clue"
        },
        {
          "text": ". I stop.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Maybe the search starts here.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_002",
      "title": "2-10am-badge",
      "type": "memory",
      "year": 1945,
      "time": "10am",
      "unlock_clue": "badge",
      "new_clues": [
        "red"
      ],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "“Hey, Gregor.” Billy waves from a distance, then stops in front of me.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "This guy puffs out his chest on purpose. That Gendarme badge is polished brighter than mine.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "He lowers his voice and says he has an important capture mission.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "“I remember that woman,” he says. “We knew her when we were kids. The one who always wore a ",
          "style": "default"
        },
        {
          "text": "red",
          "style": "clue"
        },
        {
          "text": " dress.”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "My face shows no expression. I raise my hand and salute him. “Loyal to the General.”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "He returns the salute, solemn. As I turn to leave, his voice comes from behind me.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "“I guess you got the mission too, Gregor. Let's see who can catch her first.”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "“Just so you know, if she dares to resist, I'll execute her on the spot.”",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_003",
      "title": "3-10am-red",
      "type": "memory",
      "year": 1945,
      "time": "10am",
      "unlock_clue": "red",
      "new_clues": [
        "photo"
      ],
      "unlock_type": "count",
      "unlock_condition": {
        "required_cards": 9
      },
      "content": [
        {
          "text": "I turn into an empty alley and finally open my wallet, taking out the creased ",
          "style": "default"
        },
        {
          "text": "photo",
          "style": "clue"
        },
        {
          "text": ".",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Two children are in the photo. In a field, she wears a red dress, and we laugh without a care.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The wanted poster photo and my keepsake photo—two images of the same girl—overlap. Camellia.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Stealing secrets? They have no idea. Her genius is worth more than all their secrets combined.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The day she leaves for university in the capital, I promise I'll go see her…",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I don't expect her to return—and as a fugitive.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "What on earth happens?",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I have to find her first. Before anyone else.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_004",
      "title": "4-9am-toast",
      "type": "memory",
      "year": 1945,
      "time": "9am",
      "unlock_clue": "toast",
      "new_clues": [
        "cat",
        "cigarette"
      ],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "I push open the bakery door. The bell gives a dull clang. The air is warm with toast, the aroma of bread mixing with ",
          "style": "default"
        },
        {
          "text": "cigarette",
          "style": "clue"
        },
        {
          "text": " smoke; it makes me a little dizzy.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The man behind the counter glances at me and keeps wiping the tray in his hands. I set the photo down in front of him. “Have you seen this person?”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "His gaze skims the photo in less than a second. He shakes his head and points outside. “Go ask across the street.”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Something furry brushes my trouser leg.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "An orange ",
          "style": "default"
        },
        {
          "text": "cat",
          "style": "clue"
        },
        {
          "text": "! Very fat, probably from too much bread. It squats by my feet and looks up at me lazily.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "A cat doesn't belong in a food shop; the bread will be covered in cat hair.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_005",
      "title": "5-1pm-cat",
      "type": "memory",
      "year": 1995,
      "time": "1pm",
      "unlock_clue": "cat",
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "A black cat lies on the table, watching me.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I seem to be in a bookstore. What am I doing here? …Right—looking for someone.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I ask the woman if Camellia is here. Her expression turns odd, edged with impatience.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "“Who's Camellia?” she says. “Never heard the name.”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Impossible. She must know her.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I have to show her the photo. I start searching my wallet. The photo…",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Where did it go?",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The black cat on the table just watches me.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_006",
      "title": "6-11am-cigarette",
      "type": "memory",
      "year": 1945,
      "time": "11am",
      "unlock_clue": "cigarette",
      "new_clues": [
        "soil"
      ],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "Someone sits on the steps. A choking reek of cigarette smoke comes off him. It's a newspaper-rolled cigarette; the smell of ink mixes in.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "It's an old man. I walk up and stand at attention. “Loyal to the General!”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "He raises his head. One eye is cloudy, like a rubber ball. The other fixes on the photo I hand him.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "He starts to laugh, a sound like a dry cough.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "“The General?” His voice is loud enough to ring in my ears.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "“I don't care about any General!” He grinds the cigarette into the ground. “Want to arrest someone? Arrest me! I don't have many days left anyway.”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": ""Has the General ever treated us like humans?" He points to his cloudy eye, then taps his ear. "I was already dead when I lay in that toxic ",
          "style": "default"
        },
        {
          "text": "soil",
          "style": "clue"
        },
        {
          "text": ".”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I take back the photo. His shouts carry behind me. I don't turn back.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_007",
      "title": "7-11pm-soil",
      "type": "memory",
      "year": 1945,
      "time": "11pm",
      "unlock_clue": "soil",
      "new_clues": [
        "ice"
      ],
      "unlock_type": "question",
      "unlock_condition": {
        "question": "What project is the secret document carried by the defector about?",
        "answer": ["Project Iron", "Iron"],
        "preview_lines": 1,
        "hint": "Neural pulses detected in Memory 13"
      },
      "content": [
        {
          "text": "A basin of cold water pours down from above.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Bone-chilling, like ",
          "style": "default"
        },       
        {
          "text": "ice",
          "style": "clue"
        },
        {
          "text": ".",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Only now do I realize I'm tied to a chair. This is an interrogation room.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Shouts come from outside the window, the crackle of machine-guns, and one more word: “…Project Iron…”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The red light dances on the wall. I can picture the whole city burning beyond the window.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I close my eyes.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_008",
      "title": "8-3pm-soil",
      "type": "memory",
      "year": 1945,
      "time": "3pm",
      "unlock_clue": "soil",
      "new_clues": [
        "sunflower"
      ],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "Before me stretches a ",
          "style": "default"
        },
        {
          "text": "sunflower",
          "style": "clue"
        },
        {
          "text": " field. The air smells of damp soil.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "At the far edge, across a narrow river, lies the border.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "It's been hours. The bakery, the square, the flea market… My pace keeps quickening, but I still haven't found a single clue about Camellia.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "No… the bookstore owner—she must know something.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Other Gendarmes move along the street. Their steps are as fast as mine.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "A gaze stays on my back; I can't shake it.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Is it Billy?",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_009",
      "title": "9-9pm-sunflower",
      "type": "memory",
      "year": 1945,
      "time": "9pm",
      "unlock_clue": "sunflower",
      "new_clues": [
        "firework"
      ],
      "unlock_type": "count",
      "unlock_condition": {
        "required_cards": 18
      },
      "content": [
        {
          "text": "“Come on,” she says. “Let's go somewhere farther.”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I grip Camellia's hand and run through the sunflower field. The silent flowers throw long shadows that maybe cover our tracks.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I hear the river, louder and louder. Under the moonlight, it's a silver border.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I stop and press a cold metal tube into her hand. “Across the river is the border. Launch it, and people on the other side will come for you.” I meet her eyes. “It's beautiful—like a ",
          "style": "default"
        },
        {
          "text": "firework",
          "style": "clue"
        },
        {
          "text": ".”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "A distant loudspeaker jolts to life. Distorted static, my name shouted again and again. The pursuers are here.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I let her hand go, turn, and don't look back.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "“Go. Quickly,” I say. “I'll hold them off here.”",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_010",
      "title": "10-12pm-photo",
      "type": "memory",
      "year": 1945,
      "time": "12pm",
      "unlock_clue": "photo",
      "new_clues": [
        "Mozart"
      ],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "Before I even step in, I hear music—",
          "style": "default"
        },
        {
          "text": "Mozart",
          "style": "clue"
        },
        {
          "text": ", most likely. The General dislikes this composer. In this city, only this bookstore dares to play his music.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I push the door open. The music keeps playing; conversation and the rustle of pages stop.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The woman behind the counter looks at me. Everyone else does, too.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I clear my throat. I don't salute. I lay the wanted poster on the counter. “Have you seen her?”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "She shakes her head.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I take back the poster, then pull a faded photograph from my wallet.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Her gaze lingers on it for a long time. “Camellia,” she says.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "She looks up. “Who are you—the gendarmerie captain's son, or Gregor?”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "“I don't know,” I say.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I turn and leave the bookstore.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_011",
      "title": "11-4pm-Mozart",
      "type": "memory",
      "year": 1945,
      "time": "4pm",
      "unlock_clue": "Mozart",
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "Dusk approaches. I still wander the streets like a fly. No clue about Camellia anywhere.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "A boy appears in front of me—under ten, light hair like Mozart.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I think I've seen him in the bookstore.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "He hands me a letter, then runs off.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I open the envelope. Elegant handwriting on brown paper—",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Dear Gregor,",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "If you lose your memory, are you still you?",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "If the people lose their memory, what are they still living for?",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "If the soldiers lose their memory, who are they still fighting for?",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I hope to hear your answer.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Come meet me in the small house behind the bookstore.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "No signature.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_012",
      "title": "12-5pm-Mozart",
      "type": "memory",
      "year": 1945,
      "time": "5pm",
      "unlock_clue": "Mozart",
      "new_clues": [
        "tea"
      ],
      "unlock_type": "question",
      "unlock_condition": {
        "question": "If you lose your ████, are you still you?",
        "answer": ["memory", "no"],
        "preview_lines": 2,
        "hint": "Neural pulses detected in Memory 11"
      },
      "content": [
        {
          "text": "The record spins. A familiar melody.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Mozart's K. 331, first movement.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "When we were little, Camellia somehow got this record. We hid in the basement to listen. I was terrified after a short while, but she made me stay to the end.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "A figure stands with her back to me, boiling water at the stove.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The girl with flaxen hair turns. Camellia.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "“You're thinner, Gregor.” There isn't a trace of a fugitive's panic on her face.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Behind her glasses, her eyes are the same as ever—calm, bright.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Her face flickers in the candlelight. “Are you here to arrest me?”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I say nothing. Silence is the only answer I can give.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "She doesn't seem surprised. She picks up a cassette from the table and taps it. “I know you're curious about this.”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Then she sets two teacups side by side. “Sit down first,” she says. “Let's have some ",
          "style": "default"
        },
        {
          "text": "tea",
          "style": "clue"
        },
        {
          "text": ".”",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_013",
      "title": "13-6pm-tea",
      "type": "memory",
      "year": 1945,
      "time": "6pm",
      "unlock_clue": "tea",
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "The music stops. Only our breathing remains in the room.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "She tells me the secret on the tape—Project Iron. This insane, anti-human idea tears away the last layer of the General's disguise in my heart.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "We both once served the General. She became a scientist; I became a gendarme. But she made her choice.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Now it's my turn.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I think of that old soldier—his clouded eye, his roar: “Has he ever seen us as human?”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I lift the teacup and take another sip. The tea is already cold; bitterness pools at the root of my tongue.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "“The people at the bookstore are ready,” Camellia says, breaking the silence. “Give me a few more days and I can get across the border with this cassette.”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "“Just a few days,” she says, looking at me. “Let me hide here for a few days.”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "“No,” I say.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "“I can get you out of here today.”",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_014",
      "title": "14-7pm-ice",
      "type": "memory",
      "year": 1945,
      "time": "7pm",
      "unlock_clue": "ice",
      "new_clues": [
        "Wagner"
      ],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "Dusk falls. I'm back in the sunflower field.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I move through the drooping heads toward the far edge. The rusty wire fence is there.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "My memory is right. I crouch and part the weeds—there's a hole.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I scoop away the loose soil with my hands, widening it.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The river runs beside it. I lower my hand into the water. It's summer, but the cold bites—like ice.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I hear music: ",
          "style": "default"
        },
        {
          "text": "Wagner",
          "style": "clue"
        },
        {
          "text": ". The army's taste. Sentries man the guard post not far off.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I know their patrol schedule. If we use the blind spot, we can get out here.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Time is short. I have to go back now and bring Camellia.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_015",
      "title": "15-8pm-Wagner",
      "type": "memory",
      "year": 1945,
      "time": "8pm",
      "unlock_clue": "Wagner",
      "new_clues": [
        "gun",
        "fire"
      ],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "Billy flips on the radio. Wagner plays, then the General's speech.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "“You're so stupid, Gregor. You didn't even notice I was following you the whole time.” He bursts out laughing.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I pinch my thigh, hard. He's right. I'm stupid. When I rush back to the cabin from the field, it's empty. Only the ",
          "style": "default"
        },
        {
          "text": "fire",
          "style": "clue"
        },
        {
          "text": " of candle burns quietly.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Now, in the interrogation room, Camellia sits tied to the chair opposite me. She says nothing.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "",
          "style": "default"
        },
        {
          "text": "Billy paced slowly around the room, like a victor.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Then he picked up the ",
          "style": "default"
        },
        {
          "text": "gun",
          "style": "clue"
        },
        {
          "text": " from the table and tucked it into his waist.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_016",
      "title": "16-8pm-fire",
      "type": "memory",
      "year": 1945,
      "time": "8pm",
      "unlock_clue": "fire",
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "The interrogation room light is a harsh white. Billy stands in front of me, smug. But something is wrong…",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Why is he the only one here? Where are the other gendarmes?",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "At the edge of my vision, the window glints. Firelight flickers on the glass. I hear drilled chants.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "“Your father went to deal with the riot. Those troublemakers from the bookstore are asking to die.” Billy reads my mind. “What a pity—our captain has a traitor for a son.”",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I ignore his taunts. Camellia blinks.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "She looks at me, then at Billy's waist.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Is it a signal?",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I see the gun.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "This is my last chance.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_017",
      "title": "17-8pm-gun",
      "type": "memory",
      "year": 1945,
      "time": "8pm",
      "unlock_clue": "gun",
      "new_clues": [
        "blood"
      ],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "Now.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I lunge at Billy. Thud—the corner of the table slams into the back of my head.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Damn it. This guy is quick.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "My goal is only the gun at his waist. I charge again. His knee drives into my ribs; the sharp pain knocks the strength out of me.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "A crisp metallic click—the gun loads. He tears free.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I touch the back of my head. It's sticky. ",
          "style": "default"
        },
        {
          "text": "Blood",
          "style": "clue"
        },
        {
          "text": ".",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The dark muzzle points at me.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "No—the muzzle swings past me, onto Camellia.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "“I told you, Gregor. If she resists: summary execution.”",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_018",
      "title": "18-8pm-blood",
      "type": "memory",
      "year": 1945,
      "time": "8pm",
      "unlock_clue": "blood",
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "I pull the trigger.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "A dull thud.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Someone falls. But…",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Blood wells from her chest.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Her face drains pale. Her lips move, trying to form words, but all I hear is a thin, empty breath.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I kill Camellia.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I kill her.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "This is wrong. It has to be wrong.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Where is Billy? Where did this gun come from? How could I kill her?",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "My hand shakes hard. The gun slips to the floor. My legs give, and I kneel.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_019",
      "title": "19-8pm-blood",
      "type": "memory",
      "year": 1945,
      "time": "8pm",
      "unlock_clue": null,
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "A dull thud.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The world goes red. Then the iron smell—warm, sticky—spreads across my eyes.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Warm hands wipe the blood away. I look up.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Camellia…?",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "She is alive. She looks at me, her face smeared with blood.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "But it isn't hers.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Billy lies there. His hand is twisted at a strange angle, still clutching half an exploded, smoking gun.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "An accident? Or did someone tamper with it…",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "It doesn't matter. Maybe this is the revelation: we have to leave tonight.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_020",
      "title": "20-10pm-firework",
      "type": "memory",
      "year": 1945,
      "time": "10pm",
      "unlock_clue": "firework",
      "new_clues": [
        "Calluna"
      ],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "A yellow firework blooms in the night sky, like a sunflower. I know it's her signal—she makes it.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I stop. I don't run anymore.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "A taste of iron floods my throat. My lungs feel ready to burst.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Footsteps close in from all directions.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "There's a floral scent in the air. Small purple flowers grow in the sunflowers' shadow.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Countless dark muzzles train on me.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "It's ",
          "style": "default"
        },
        {
          "text": "Calluna",
          "style": "clue"
        },
        {
          "text": ", isn't it? A honeyed scent. I once thought it was the smell of sunflowers.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "People think of random things when they're nervous. This might be the last minute of my life.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Father? In the ring of faces, I think I see him.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I draw a deep breath, ready for my final words.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_021",
      "title": "21-10pm-Calluna",
      "type": "memory",
      "year": 1995,
      "time": "10pm",
      "unlock_clue": "Calluna",
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "“Father! You're all wrong!” I shout.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I stare at his face. His expression shifts from cold indifference to confusion.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Maybe the sweetness of the Calluna makes me dizzy, or maybe the running has burned off the last of the oxygen in my brain.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "That man's features begin to warp, twisting into a knot.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "“Father?” he says.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_022",
      "title": "22-10pm-Calluna",
      "type": "memory",
      "year": 1945,
      "time": "10pm",
      "unlock_clue": "Calluna",
      "new_clues": [
        "Death"
      ],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "A gendarme charges over. Something hard smashes into the back of my head.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I drop. It feels like an insect crawls along my neck—itching.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The Calluna grows stronger. I like this honeyed smell, like a purple dream.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I see the shadow of ",
          "style": "default"
        },
        {
          "text": "Death",
          "style": "clue"
        },
        {
          "text": ". He swings His huge scythe and walks toward me.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "But I'm not afraid. I want Him to come. I just want to sleep forever in this scent.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_023",
      "title": "23-5pm-death",
      "type": "memory",
      "year": 1995,
      "time": "5pm",
      "unlock_clue": "Death",
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "Dusk is when my sight is at its worst.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The golden-red clouds are burning, the sunflower fields are burning. I can't see clearly.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Nothing makes sense. Perhaps I will never find her. Perhaps I cannot save her. Perhaps she never existed at all.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I killed her but maybe she never existed the fire burns brighter and brighter the river water is ice to the bone I remember that river the golden waves of sunflowers and the color of blood the smell of burning the smell of honey the air trembles as if the sky is burning the sunflowers my memory full of holes all ashes I can't hold onto anything I killed her correct I must have killed her or else why am I here walking endlessly searching for that river that field of flowers that shadow always following me",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I killed Camellia",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Right?",
          "style": "default",
          "breakAfter": true
        },
        {
          "type": "auto_sequence",
          "delay": 500,
          "content": [
            { "text": "Yes", "style": "default" },
            { "text": "I killed her", "style": "default" },
            { "text": "yes I killed her", "style": "default" }
          ]
        },
        {
          "type": "auto_sequence",
          "delay": 400,
          "content": [
            { "text": "yes I killed her", "style": "default" },
            { "text": "yes I killed her", "style": "default" },
            { "text": "yes I kiled her", "style": "default" }
          ]
        },
        {
          "type": "auto_sequence",
          "delay": 300,
          "content": [
            { "text": "yse I kileld her", "style": "default" },
            { "text": "yes I killef hre", "style": "default" },
            { "text": "yess I killd her", "style": "default" },
            { "text": "yes I killed hre", "style": "default" },
            { "text": "yes i kille d her", "style": "default" }
          ]
        },
        {
          "type": "auto_sequence",
          "delay": 200,
          "content": [
            { "text": "YEs I killed her", "style": "default" },
            { "text": "yes i KILLED her", "style": "default" },
            { "text": "YEs i kiLLed hEr", "style": "default" },
            { "text": "yse I killed her", "style": "default" }
          ]
        },
        {
          "type": "auto_sequence",
          "delay": 120,
          "content": [
            { "text": "yse I KILLED hre", "style": "default" },
            { "text": "yEs i kilLed hrryesIkilledher", "style": "default" },
            { "text": "yse I KILLED hre", "style": "default" },
            { "text": "yEs i kilLed hrryesIkilledher", "style": "default" },
            { "text": "yse I kill kill kil her", "style": "default" }
          ]
        },
        {
          "type": "auto_sequence",
          "delay": 80,
          "content": [
            { "text": "i KILLED hER YES I", "style": "default" },
            { "text": "yEs i kilLed hrryesIkilledher", "style": "default" },
            { "text": "kille d hre yse i killd", "style": "default" },
            { "text": "yse I KILLED hre", "style": "default" },
            { "text": "yes i kille d her", "style": "default" },
            { "text": "YSE I KILLEDHERIKILLEDHER", "style": "default" }
          ]
        },
        {
          "text": "An old woman blocks my way.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "A strange face.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "She is calling my name. \"Gregor!\"",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The sound is piercing, my head hurts.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I don't know her.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "No, I've seen her. This face is strange and familiar.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "It is Death.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "She has come to punish me.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I see a huge shadow rising behind her lifting a scythe.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I ran away in a hurry.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "file_001",
      "title": "About Republic of Lyria",
      "type": "file",
      "year": null,
      "time": null,
      "unlock_by": ["mem_006"],
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "From: Embassy of ██ in the Republic of Lyria",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Subject: Weekly Situation Report on General ████'s Regime",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "General ████'s control remains firm. The entire state apparatus appears to serve a core national policy of sustained military aggression against neighboring countries. To sustain this effort, nationwide mandatory conscription is being strictly enforced, with large numbers of young people being sent to the front.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "However, cracks have appeared beneath the regime's façade of stability. Consistent reporting from the front confirms that the General's forces are suffering a series of significant military setbacks. At the same time, the domestic economy is deteriorating rapidly. The war has crippled livelihoods, and the national standard of living has fallen to dangerous levels.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Notably, the regime's official narrative does not attribute these defeats to strategic or logistical errors. According to intelligence from internal meetings, General ████ attributes the root cause of failure to the "corrosion of morale" among his soldiers.",
          "style": "default"
        },
        {
          "text": "",
          "style": "default"
        },
        {
          "text": "His official report states that the psychological impact of battlefield trauma and defeat are the core factors eroding his army's will to fight. We assess the regime is likely to take extreme measures to address this "psychological problem." We will continue to monitor this closely.",
          "style": "default"
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "file_002",
      "title": "About Project Iron (Part 1)",
      "type": "file",
      "year": null,
      "time": null,
      "unlock_by": ["mem_013"],
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Internal Document: Top Secret",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "To: The Great Leader, General ████",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "From: Capital Academy of Sciences, “Project Iron” Team",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Subject: “Project Iron” Phase One Progress Report",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Your Excellency, the General:",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Pursuant to your directive, “Project Iron” has been fully initiated, aimed at eradicating the “corrosion of morale” caused by enemy psychological warfare and personal emotional ties among frontline troops. The sole objective of this project is to forge for you an iron army of absolute loyalty, devoid of fear, and fully free from the bonds of emotion and traumatic memory.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "The core of the project is the “Targeted Memory Purification Technology,” designed to precisely eliminate three categories of “mental impurities” from soldiers' minds:",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Defeatist memories: Negative memories concerning defeat, retreat, and casualties.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Traumatic stress: Irrational emotions such as fear and hesitation triggered by battlefield imagery.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Individualistic emotions: Attachments unrelated to collective honor, such as “family” and “kinship.”",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Under your spiritual inspiration, the project team is working day and night. It is worth noting that a gifted young female student on the team has made outstanding contributions to the core theoretical breakthrough, demonstrating the new generation's absolute loyalty to your cause.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "The project is currently at a critical breakthrough stage and will deliver Phase One results shortly. We firmly believe that “Project Iron” will become the sharpest sword in your hand, assisting you in achieving eternal victory.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "file_003",
      "title": "About Project Iron (Part 2)",
      "type": "file",
      "year": null,
      "time": null,
      "unlock_by": ["file_005"],
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "To: The Great Leader, General ████",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "From: Capital Academy of Sciences, “Project Iron” Team",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Subject: “Project Iron” Phase Two Progress and Emergency Contingency Report",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Your Excellency, the General:",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "It is with deepest regret that we report a serious lapse in the academy's security. The project's key scientist (the young female student referenced in the previous report) has been confirmed to have defected. She has stolen portions of core data, causing a setback in research and development. To compensate for this failure and deliver usable results to you as soon as possible, the project team has activated the emergency contingency plan.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "While researching “memory purification,” the academy achieved an unexpected breakthrough in “Targeted Memory Implantation Technology.” Testing has shown that implanting a new memory is far more efficient and stable than deleting an old one. An implanted memory is like a seed; it rapidly takes root and intertwines with the target's original memory network, achieving an effect that is nearly impossible to separate.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "If this technology passes testing, its strategic value will be immeasurable. For example, we could mass-implant high-value beliefs—such as an “unwavering conviction in victory”—into our soldiers.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "With your approval, we have already conducted preliminary experiments on death-row inmates and select prisoners convicted of treason:",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Experiment Subject A: ███, former Political Commissar of the Seventh Army Group, sentenced to death for treason.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Experiment Content: Successfully implanted a false memory of █████████ prior to his execution.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Experiment Result: The subject exhibited extreme self-reproach and a complete mental breakdown, ultimately committing suicide in his cell. The effect was significant.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Experiment Subject B: Gregor, former gendarme, sentenced to life imprisonment for assisting in the key scientist's defection.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Experiment Content: Successfully implanted a key false memory.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Experiment Result: The subject has completely accepted the implanted memory without any signs of rejection. He is currently under long-term observation to evaluate its stability.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "We will redouble our efforts to deliver a mature, controllable technological result to you as soon as possible. Everything for your victory.",
          "style": "default"
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "file_004",
      "title": "About bookstore",
      "type": "file",
      "year": null,
      "time": null,
      "unlock_by": ["mem_016"],
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Clipping from “The Liberty Times”",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Title: The Embers Among the Pages",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Under the General's rule, the only bookstore in that border city is not only a sanctuary for thought but also a key stronghold of the revolution.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "The turning point comes on August 31st. To protect a scientist carrying evidence of “Project Iron,” the bookstore's comrades, after her secret arrest by the Gendarmerie, resolutely march to Gendarmerie headquarters to protest.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "They publicly expose the evil plot to turn the nation's citizens into heartless machines. The truth ignites the long-suppressed fury of the people. On that day, the cries from the bookstore finally converge into a revolutionary torrent that sweeps the entire nation.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Revolution always comes with sacrifice. Let us salute Comrade ███, Comrade ███, and Comrade ███, who gave their lives that day!",
          "style": "default"
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "file_005",
      "title": "About Carol",
      "type": "file",
      "year": null,
      "time": null,
      "unlock_by": ["mem_024"],
      "new_clues": [],
      "unlock_type": "question",
      "unlock_condition": {
        "question": "What cognitive disorder does Gregor suffer from?",
        "answer": ["ad", "alzheimer’s disease", "alzheimer", "alzheimer's disease","alzheimer's","alzheimer’s",'alzheimers'],
        "preview_lines": 8,
        "hint": "Correlated signal detected in Son's Diary"
      },
      "content": [
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Identity: Renowned neuroscientist; Professor at Capital University.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Bio: Exposed the former regime's Project Iron; participated in the revolution that overthrew the former regime.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Research Field: Memory representation and retrieval.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Note: It is rumored that her research is related to her husband, Gregor, who is reported to suffer from a cognitive disorder.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Note 2: Formerly known as Camellia",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "✓ Secret files unlocked.",
          "style": "success",
          "trigger_unlock": true,
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "file_006",
      "title": "About Alzheimer's disease",
      "type": "file",
      "year": null,
      "time": null,
      "unlock_by": ["file_009"],
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Document: Informational brief on Alzheimer's disease (AD)",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Patients may become trapped in the memory of a single day.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Patients gradually fail to recognize familiar people, including close family members.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Patients lose their ability to reality-test, confusing memories from different time periods.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Memory, as if burning, becomes full of holes; details and emotions gradually dissipate.",
          "style": "default"
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "file_007",
      "title": "Son's Diary - January 8th",
      "type": "file",
      "year": null,
      "time": null,
      "unlock_by": ["mem_024"],
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "This afternoon, I found Father in the study, staring blankly at a book—an old Introduction to Neuroscience with yellowed pages. He just stared at the cover, his fingers absently rubbing it, as if touching something completely unfamiliar.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "I walked over and gently slid the book from his hands. He didn't resist; he only raised his head and looked at me with that familiar, empty gaze.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "I opened the book. On the flyleaf was Mother's elegant handwriting: “Thank you, memory, for making us who we are.”",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Mother once said that after the revolution succeeded, Grandfather saved Father's life. But she had thought he was dead—until they reunited in the Capital University library. Mother recalled they didn't say a word, just looked at each other. Father silently picked up the heavy stack of books in front of her and handed her his handkerchief to wipe away her silent tears.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "How we wish he still remembered all this. But now, after his illness, when he faces Mother, he only asks, cautiously, “Who are you?”",
          "style": "default"
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "file_008",
      "title": "Son's Diary - July 20th",
      "type": "file",
      "year": null,
      "time": null,
      "unlock_by": ["file_007"],
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "This morning, he called me “Father” again.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "I was handing him his coffee. He took it naturally, said “Thank you, Father,” and then asked me to remind him to report to the Gendarmerie today. I didn't know how to answer, so I just nodded and turned back to the kitchen.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "This is our daily life. In this house, I am no longer his son but his father. My mother—the woman he has loved his entire life—he often doesn't recognize, occasionally asking if she is the “landlady.” And he himself is a young gendarme, living the same “August 31st” every day.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "He leaves the house on time every morning, politely bids farewell to the “landlady,” and then begins his endless search. Searching for a young girl named Camellia.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "He takes that faded old photograph and asks everyone in the neighborhood. The bookstore owner has already called me three times, and the neighbors are giving me increasingly strange looks. I can only keep apologizing, explaining to everyone: “My father… he's ill.”",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "The hardest part is dusk. Whenever the sun sets, his symptoms get worse. He mutters that the sky is burning, the sunflowers are burning. He also curses someone named Billy. Sometimes he flies into a sudden rage, and other times he just curls up on the sofa, like a lost child.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Mother always locks herself in the study at this time. I know she's poring over those old research materials again. She says she must continue her original research, but this time it's to bring him back. I look at her bloodshot eyes, not knowing what to say.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "We are all fighting, in our own ways, against this monster that is slowly devouring Father. It's just that, so far, we have never won.",
          "style": "default"
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "file_009",
      "title": "Son's Diary - October 24th",
      "type": "file",
      "year": null,
      "time": null,
      "unlock_by": ["file_008"],
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "He fell into the river.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "This morning, he went out to “find Camellia” as usual, but he didn't come back by noon. We called the police. In the afternoon, they found him by the river outside the city. They said he might have slipped while searching for something along the riverbank.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Now he is lying in a hospital bed, full of tubes. The doctor says his life is not in danger, but he remains unconscious.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Mother is exceptionally calm. She hasn't cried. She just sits by the bed all day, holding Father's hand.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "At night, she told me she is going to bring “that thing.”",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "I know what she means—the complex instrument with the green-glowing screen, the one she brought back from the university lab and has been modifying in the study for countless nights. She says this is the only chance.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "I look at Father's pale face, then at Mother's resolute eyes. What else can I say?",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Right now, I am standing at the door of the hospital room. Mother is inside, gently placing the instrument's connectors on Father's forehead. The screen lights, and countless data points begin to scroll.",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "What on earth will she find in Father's memory?",
          "style": "default"
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "An answer? Or a… deeper labyrinth?",
          "style": "default"
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "file_010",
      "title": "#README",
      "type": "file",
      "year": null,
      "time": null,
      "unlock_by": [],
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Hello, user Carol.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Welcome to MindMirror Beta.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "This is an instrument based on cognitive neuroscience that presents an individual's memories in real time.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Instrument Status: Working",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Patient Name: Gregor",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Patient Status: ████. Vital signs stable.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Connected to patient's brain. Sync rate: 97%.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Guiding Principles:",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Never delete the patient's memories.",
          "style": "default",
          "breakAfter": true 
        }
,
        {
          "text": "Never modify the patient's memories.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Never harm the patient.",
          "style": "default",
          "breakAfter": true  
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "file_011",
      "title": "#Memory",
      "type": "file",
      "year": null,
      "time": null,
      "unlock_by": ["file_010"],
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Do you know Proust's madeleine?",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "When the literary master dipped a piece of cake into his tea, childhood memories rose with the scent of orange blossoms.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "The senses are keys to memory—sight, hearing, smell, taste, touch.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "For different memories, each sense has its own effect.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "In the patient's memories, you will see words called clues.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Search for them to reveal more memories.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Searching for words other than the designated clues is meaningless.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Search Method:",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Click a clue word, or type it into the terminal, then press Enter.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "You can start with \"",
          "style": "default"
        }
,
        {
          "text": "coffee",
          "style": "clue"
        }
,
        {
          "text": "\".",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "file_012",
      "title": "#File",
      "type": "file",
      "year": null,
      "time": null,
      "unlock_by": ["file_001"],
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "The items in the File list are not subjective memories but objective, factual information.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Files will never deceive you.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "This instrument is connected to the local network.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "When certain memories are discovered, the instrument will operate automatically,",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "collecting related Files and developer-provided instructions (such as this text).",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "file_013",
      "title": "#Sort",
      "type": "file",
      "year": null,
      "time": null,
      "unlock_by": ["mem_014"],
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "You may have already noticed:",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "these memories are from the same date.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "If you wish to sort by time, click the [SORT] button, then type time.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "To restore the default sort, click the [SEARCH] button to return to search mode.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "file_014",
      "title": "#Sort-2",
      "type": "file",
      "year": null,
      "time": null,
      "unlock_by": ["file_018"],
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "The same date, but not the same year.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Only by realizing this can the contradictions in the memories be explained.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "The long August 31st. Gregor's summer has never ended.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Year information is now unlocked.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "If you wish to sort by year, type year in sort mode.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "If you already noticed the difference between the regular and italicized dates…",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "So clever, just like me.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Arriving here once again. This time, what is your (my) decision?",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "file_015",
      "title": "#Delete",
      "type": "file",
      "year": null,
      "time": null,
      "unlock_by": ["file_003"],
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Writing to myself:",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Carol, or should I say, Camellia.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "How many times have I reviewed his memories?",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Today, will I (you) finally make the decision?",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "According to my research, the trigger of his symptoms isn't just aging,",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "it might also be an “implanted memory.”",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "This memory clearly contradicts the facts, yet he cannot escape it.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "As he ages, it continually erodes his other memories.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Just like burning…",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Click the [DELETE] button to enter delete mode, then type the memory index.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "The index is the number before the filename.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "For example, type 1 to delete memory 1-8am-coffee.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Gregor and I believe that we are made of our memories.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "If one is deleted, are we still the same person?",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "But what if that memory was never his?",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Gregor might return to his “original” self — but where does the self he is now go?",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "What I am about to do—how is it different from Project Iron?",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "file_016",
      "title": "#Delete-2",
      "type": "file",
      "year": null,
      "time": null,
      "unlock_by": ["_animation_unlock"],
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Writing to myself:",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "If you are reading this document—the worst has already happened.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "This implanted memory cannot be deleted individually.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "It has already seeped into every part of his brain, entangled with countless neurons.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "If this memory must be deleted, it can only be “pulled out by the roots.”",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "Delete this memory's trigger, or theme, or clue.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "There is only one word.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Delete all memories related to this single word.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "",
          "style": "default"
        }
,
        {
          "text": "In delete mode, type the word directly.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Hint: This word is NOT from the clue list.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "file_017",
      "title": "#Defense Mechanism",
      "type": "file",
      "year": null,
      "time": null,
      "unlock_by": [
        "mem_003",
        "mem_007",
        "mem_009"
      ],
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "",
          "style": "default"
        },
        {
          "text": "Defense Mechanism.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "This is Anna Freud's theory—repression, isolation, reaction formation...",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "From a neuroscientist's perspective, these phenomena also have their neural basis.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Synapses. Impulses. Acetylcholine.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "",
          "style": "default"
        },
        {
          "text": "Some memories appear red in this device.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "This means the device temporarily cannot fully parse this memory.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "",
          "style": "default"
        },
        {
          "text": "This is a consequence of defense mechanisms.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Isolation: You need to find more associated memories to lift this mechanism.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Repression: You need to reveal the \"hidden key\" to restore the full picture of this memory.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "file_018",
      "title": "#Contradiction",
      "type": "file",
      "year": null,
      "time": null,
      "unlock_by": [
        "mem_023"
      ],
      "new_clues": [],
      "unlock_type": "question",
      "unlock_condition": {
        "question": "Type X Y",
        "answer": [
          "bookstore father",
          "father bookstore"
        ],
        "preview_lines": 30,
        "hint": "Neural pulses detected in Memory 5, 10, 21"
      },
      "content": [
        {
          "text": "",
          "style": "default"
        },
        {
          "text": "The above are all of Gregor's memories from this day—",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "A day of tears, blood, and sweat.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "",
          "style": "default"
        },
        {
          "text": "Freud once said that memory is an iceberg.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The part above water has been fully retrieved by this device,",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Yet evidence suggests key memories still exist, repressed beneath the surface.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "",
          "style": "default"
        },
        {
          "text": "Based on EEG analysis, contradictions exist among the parsed memories.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "For example: Did Gregor really kill Camellia?",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "",
          "style": "default"
        },
        {
          "text": "The device did capture Gregor's memory of killing Camellia with his own hands.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "But memories of Gregor escaping with Camellia afterward also exist.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "",
          "style": "default"
        },
        {
          "text": "Besides this, there are two other obvious contradictions.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "",
          "style": "default"
        },
        {
          "text": "X",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "A place name,",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Gregor visited this place multiple times,",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "From here he obtained information about Camellia,",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "But contradictions exist within this information.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "",
          "style": "default"
        },
        {
          "text": "Y",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "A person,",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Gregor was very familiar with this person,",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "However, in a certain memory, when Gregor spoke with them,",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Y's behavior was unexpected, as if completely unfamiliar with Gregor.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "",
          "style": "default"
        },
        {
          "text": "If you find these two key contradictions, perhaps you can further excavate Gregor's memories.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Please review the memories and enter X and Y as your answer (two words, separated by a space).",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "X is a place, Y is a person.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "",
          "style": "default"
        },
        {
          "text": "✓ Secret file unlocked.",
          "style": "success",
          "trigger_unlock": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_024",
      "title": "91l-8pm-obodp",
      "type": "memory",
      "year": 1945,
      "time": "8pm",
      "unlock_by": [],
      "new_clues": [],
      "unlock_type": "sort_year_first",
      "unlock_condition": null,
      "content": [
        {
          "text": "A dhul tlud.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "Te wormy rld gos .  thhe ion smelThen—waerm, stily—spreads acssck red eroyes.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "icel…?amla",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text":"Wm hanipewk up the bod awaray. I loods lo.",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "̶̛̬̤̣͔̻͖̣̪̬͋̋͛̂̑̔̊͂̐͘s̷̠̦̮̣̹̹̘̼̰̹͒͐̊͐̀t̸̢̨̺͇̥̞͓̹̞͔̹̘̫̪͓́̀̉̿͂͊̈́̆͆̿̂͂̂i̵̥̟̮̤͉̳̅͜͜l̵̟̠̬̔͋̀̽̉͗̿̌ȳ̶̧̯̭̫—̴͓̈́̽̏̈́̉͛̈͑̄͘̚͝s̷̜̳̱͔̬̥̥̰̃̈́̍͆͘̕͝p̴͓̥̽̓͆́̈́̏̑̂r̶̛̰̱̳̭͗̿͊̓͆̃́̈́̓͂ͅe̵̡̙̺̟̰̲̜͝ͅa̶̗͈̲̿̾d̸̪͚͚̙̥̗͑͐̈́̏͆̊͌͊̚s̶̡̛̼̯̠̞͍̺̙̝̮̜͑͋͂̐̾̋̑̍̐͘͝͠͠ ̷̳͚̤̝͕̘͉͕̞͓̣̞͇̼̳͋͆͒̽",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "̴̧͙̼̲̯̯̈́̏̇̃͂̏̒̃͊̀͑̓̏̚t̵̡̛̬̟̻̰͆̄̉͘h̶͈̭͉͎̳͕̙͚̄͋͋͊̈̍͂͝͝ȩ̵̰̗̲̦͍̘̩̗̤͓̘̀͗̋̍̐́̑͒́̀͠ͅ ̴̢̮̲͛͘b̷̥̱̹͎̲̥̥̲̘̠́͂͑̅̒͌͗̾͋͛͑̈́ͅǫ̶̳̗͔̻̝̖̘͍̪͚͔̐̏͌̐̃͂̚̕d̴̖̪͓͎͍͉̺̯͙̹͈̤̭̈́͜ͅ ̶̳̥̯̤͉͇̜͉̪̾̔̀̈͂͑̈ͅå̸̻̻̉͒̕w̵̢̨̫̠̳͈̪̥̠̟̤͖̬̿͛̉͛̊́̈́̽ã̸͔͓̹̺̹̤̲̘̳͆̃̌ͅr̷̢̪̥̭͖̫̗̜͖̰̉͌͊̈̈́̍̔å̶̡͖͚̩̺͇̟̗̙͚̘͊͒̈́̄͠y̶͚̘̩̖̘̯̞̾͛͑.̸̢̡̰͖̣̬͔̫͍̟̺̫̈́͜ͅ",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "̷̛̍́̓̐͑̿̔̿͠ͅi̶̢̧̨̛͙͑͂̀̄̽͂ç̴͕̺̪̮͉̒̕͜e̶̯̳̪̺̎̈́͝ļ̸̧̢̩͖̭̻͙̝̌̂́̄͛̿͗͒͂͊͝…̵̨̤̥̱̳̜̺̱͙͓̘̣̝͕͇̅́̋̂̐?̴̢̙̤̩̯͇̮̯̹͉̱͛̏̀͛͗͆͒̚a̶̱̞̞͚̔͜ḿ̶̛̹͓̤̻̣̤͖̈́̽͂̈́͌́͊̂̽͌l̴̛̬͋̊̎͛̍̎̉̽̃͑̆̕̕͠a̷̡͉̠̞̫͈͓̘̳̯̙̩͂̓̕",
          "style": "default",
          "breakAfter": true
        }
,
        {
          "text": "̶̧̬̲͎̻̰̗͔̓̐̉̉͂̓̓̓̉̎͠͝ȩ̵̨̡̢̡̬͕͙̜̺̪̩͋̎̅͂̈́́̍͛̚͘͘s̶̢̢̰͖̥̥̃̈n̶̼̭͔͙͈̥̩̫͔̈́̔̐̇͊͒̐̏̈́̈̄̓͜͝͝ͅ'̵̨̡͚̰̞͉̱͈̞̥͕̣̦̥͐̅͋͋͊̈͛͂̉̄̽̓͆͊̕ͅẗ̵̨̨̹͇̣͇͍̱̱̮́̇̿͋͂ ̷̢̖͖̘̞̊́̓̆̽̾͑̐́̀̕̚m̷̧͎̞̝̞̱͈̺̪̽̑̏͗̋́̃̆̚ą̸̡̼̦͚͇̺̠̜̟̭̞͙̆̄͑̈́̒̀t̴̰̝̄̀͑̈͐̄̓̄͑́̅̇̌̑̕ţ̵̳̮̠̻̤͉̞͒͐͝͠ͅn̷̢̗͖̮̳̗̰̥͔̠̳͎̺͓͒̈́͠į̴̭̻̻͙̳̼̃̓̆͊́g̸̜̊h̸̨̨̯͍̬̲̝̦̲̥̯̦̭̎͆̓̉͌̊̒̈́̅͜͝ͅt̷̳̩͕̺͈͔̃̌͌̔̅̐̆̊̓̊ͅ.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_025",
      "title": "Gregor",
      "type": "memory",
      "year": null,
      "time": null,
      "unlock_clue": null,
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "auto_play_after_first_choice": true,
      "auto_play_delay": 1500,
      "content": [
        {
          "text": "I can't tell if it's dawn or dusk. In any case, light spills over her.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I don't know her…",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The wind from the other side of the river blows her hair loose.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Golden flecks glitter in her silver hair.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Just a hint of familiarity.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I feel the wind turn cold. Summer is about to end.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "August 31st. Today is the last day of summer.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "For some reason, this day feels unusually long.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Memory is like burning paper, full of holes.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Something is burning.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Something very important to me.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I want to grab hold of it.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I clench my fist. My palm burns with pain.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I see her turn around.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "An old woman. Time has carved lines across her forehead.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "She looks at me as if about to say something.",
          "style": "default",
          "breakAfter": true
        },
        {
          "type": "choice",
          "options": [
            {
              "text": "Farewell.",
              "result": []
            },
            {
              "text": "Goodbye.",
              "result": []
            }
          ]
        },
        {
          "text": "That voice…",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "No. Don't say goodbye.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I try desperately to remember.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Me. Gregor.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Gendarme. My duty is…",
          "style": "default",
          "breakAfter": true
        },
        {
          "type": "auto_sequence",
          "delay": 800,
          "content": [
            { "text": "Sunflowers. Giant shadows.", "style": "default" },
            { "text": "\"Come on,\" that voice says, \"let's go somewhere farther.\"", "style": "default" },
            { "text": "Running. Why am I running?", "style": "default" }
          ]
        },
        {
          "type": "auto_sequence",
          "delay": 600,
          "content": [
            { "text": "A warm feeling. It's my hand.", "style": "default" },
            { "text": "I am holding her hand.", "style": "default" },
            { "text": "The cold metal tube. \"It's beautiful, just like a firework.\"", "style": "default" }
          ]
        },
        {
          "type": "auto_sequence",
          "delay": 400,
          "content": [
            { "text": "\"Go, quickly.\"", "style": "default" },
            { "text": "The loudspeaker keeps shouting my name. Over and over.", "style": "default" },
            { "text": "I start to run toward that silver border.", "style": "default" }
          ]
        },
        {
          "text": "I finally reach the riverbank.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "In the water, I see my own face.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "It's an old man, with white hair and a face full of sorrow.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "That is not me.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I am Gregor, a gendarme, 25 years old.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Really?",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "No… that is me.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "It turns out I am already an old man.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "How many years have passed since that day?",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I am trapped in this one day, trapped in an endless summer.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I raise my head and look at her again.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The lines on her forehead, the creases at the corners of her eyes… just like mine.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "But those eyes. They haven't changed.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Calm and bright.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "My memory is burning. I know I am forgetting you.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Forgetting you, Camellia.",
          "style": "default",
          "breakAfter": true
        },
        {
          "type": "choice",
          "options": [
            {
              "text": "Forget that false memory, and all of this will end.",
              "result": []
            },
            {
              "text": "Don't forget me, Gregor.",
              "result": []
            }
          ]
        },
        {
          "text": "I know what you're talking about…",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "That memory, right?",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "It's my nightmare. Countless times, that bloody scene keeps flashing through my mind.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I'm sorry… For so many years, I never told you.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "But I refuse to believe that memory.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I'd rather believe in the sunflowers. I believe in the night we escaped together. I believe in the one who has always been by my side…",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "You.",
          "style": "default",
          "breakAfter": true
        },
        {
          "type": "choice",
          "options": [
            {
              "text": "None of this is your fault.",
              "result": []
            },
            {
              "text": "But it's because of me that you are trapped in this day's memory.",
              "result": []
            }
          ]
        },
        {
          "text": "No. It's not your fault.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I know that old age will always come.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "That dusk will envelop me again and again.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I might forget. I might treat you as a stranger, madly searching for a girl who doesn't exist.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "But… I want to tell you.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I believe that at the end of that sunflower field, you will be there.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "It is not because of you that I bear the pain of aging.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "It is because of you that I have the courage to face it.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Camellia…",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "…Carol",
          "style": "default",
          "breakAfter": true,
          "delay": 4000
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_026",
      "title": "Sunflower",
      "type": "memory",
      "year": 1932,
      "time": "5pm",
      "date": "Sep 17th",
      "unlock_clue": null,
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "When I found her, it was already late.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "She was sitting in the sunflower field reading a book, and the clouds on the horizon were burning with patches of red.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I heard my own voice say, \"They are all extremely worried about your missing.\"",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "She looked very surprised, as if she had no idea that she had become the object of everyone's search.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "She closed the book and said, \"All right, let's go home.\"",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I pulled her and started running, leaving behind the orange-red that had burned all over the mountains and fields, as if I were running towards another world, or perhaps just a much farther place.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_027",
      "title": "Photo",
      "type": "memory",
      "year": 1936,
      "time": "3pm",
      "date": "Apr 23rd",
      "unlock_clue": null,
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "We walked into the darkroom.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The air was filled with a pungent smell of chemical solutions. A deep green safety lamp was quietly shining in the corner.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "She carefully placed the photo paper into the solution with tweezers, just as she usually did in her experiments.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "We held our breath in anticipation.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "In the dim light, the outlines of our two in the photo emerged first. Then, the colors gradually spread out: yellow sunflowers, red dresses, and bluish-blue skies.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "Memory... The greyish-white world was tinted with colors, step by step.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_028",
      "title": "Mozart",
      "type": "memory",
      "year": 1934,
      "time": "8pm",
      "date": "Jul 2nd",
      "unlock_clue": null,
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "The gramophone in the corner is very old. The record was spinning slowly.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "She swung in the rocking chair, eyes closed, a smile she couldn't suppress at the corners of her mouth.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "But I felt extremely frightened.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "\"Stop listening, Camellia. Someone will come to arrest us.\"",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "\"Just a piece of music. Don't you like it?\"",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The gramophone was still turning, making a rustling sound.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "\"Keep listening. I think you'll fall in love with it.\"",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I think I did.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_029",
      "title": "Firework",
      "type": "memory",
      "year": 1950,
      "time": "8pm",
      "date": "Mar 15th",
      "unlock_clue": null,
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "The square was crowded with people. I was mixed in, and the announcement of the radio rang in my ears.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "\"... Next... The heroes from various regions will ring the bell of victory for us, marking that we will march towards the next era...",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The spotlight shone on the bell tower. From afar, I seemed to see the bell ringer, a girl in a red dress.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The moment the bell rang, fireworks burst, colorful and overwhelming.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I think if I had turned back that day, the scene I would have seen would probably be exactly like this.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "She lit the fireworks again.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    },
    {
      "id": "mem_031",
      "title": "Cat",
      "type": "memory",
      "year": 1964,
      "time": "6pm",
      "date": "May 2nd",
      "unlock_clue": null,
      "new_clues": [],
      "unlock_type": "direct",
      "unlock_condition": null,
      "content": [
        {
          "text": "Our son brought back a little wild cat from outside. I have no idea how he caught it.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I had no interest in this furry and dirty little thing. I was going to drive it out, but Carol agreed to keep it.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "The exchange condition: our son will be responsible for taking care of the cat, including solving all the troubles it causes and keeping the whole house tidy at the same time.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "He agreed.",
          "style": "default",
          "breakAfter": true
        },
        {
          "text": "I took a close look at the cat. It has a pair of amber eyes.",
          "style": "default",
          "breakAfter": true
        }
      ],
      "status": "locked",
      "is_discovered": false,
      "is_read": false,
      "note": ""
    }

  ],
  "metadata": {
    "version": "1.0.0",
    "total_cards": 51,
    "last_updated": "2025-10-29",
    "game_title": "Burning Memory",
    "initial_clues": []
  }
};

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CARDS_DATA;
}
