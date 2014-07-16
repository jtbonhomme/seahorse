var seahorse       = require('../lib/seahorse');
seahorse.init("filetoload.json", 123);
seahorse.init("filetoload.json");
seahorse.init(null, 123);
seahorse.run({_:["filetload.json"], p: 123});
seahorse.run({_:[], p: 123});
