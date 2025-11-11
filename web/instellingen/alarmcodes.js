// alarmcodes.js
window.alarmcodes = [
  // 🔥 Brandmeldingen
  { woorden: [ "brandalarm" ], code: "P 1 BR (OMS)" },
  { woorden: [ "woning", "huis", "gebouw",], code: "P 1 BR (Woning)" },
  { woorden: [ "pand", "kantoor", "winkel", "school", "bibliotheek",], code: "P 1 BR (Gebouw)" },
  { woorden: [ "auto", "voertuig", "bus", "truck"], code: "P 1 BR (Voertuig)" },
  { woorden: [ "bos", "natuur", "gras", "heide"], code: "P 2 BR (Natuurbrand)" },
  { woorden: [ "schuur", "loods", "schuurbrand"], code: "P 1 BR (Schuur)" },
  { woorden: [ "container", "vuilnisbak", "afvalbak", "afval", "afvalcontainer"], code: "P 1 BR (Containerbrand)" },
  { woorden: [ "fabriek", "industrie", "industrieterrein", "bedrijfspand", "bedrijf", "bedrijfsterrein", "industriegebied"], code: "P 1 BR (Industrie)" },

  // 🚗 Ongevallen en trauma
  { woorden: ["ongeval", "trauma", "botsing", "aanrijding", "verkeersongeval", "auto", "voertuig", "motor", "brommer", "fatbike", "tram", "trein"], code: "P 1 HV (Ongeval Wegverkeer)" },
  { woorden: ["val", "trap", "hoogte", "loods", "steiger", "dak", "gebouw", "pand", "hoogteval", "val van hoogte"], code: "P1 HV (Val van hoogte)" },
  { woorden: ["snijwond", "mes", "glas", "messteek", "steekwond"], code: "A 1 Steekincident" },
  { woorden: ["schotwond", "wapen", "schieten"], code: "P 1 Schietincident" },

  // 🏥 Medische noodsituaties
  { woorden: ["reanimatie", "hartstilstand", "bewusteloos", "flauwvallen", "admeniet", "flauwte", "reanimeren", "hart"], code: "P 1 Reanimatie" },
  { woorden: ["beroerte", "hartaanval", "hartstilstand", "bewusteloos", "stroke", "hersenbloeding", "hartinfarct"], code: "P 1 Medische Noodsituatie" },
  { woorden: ["epilepsie", "aanval", "stuip", "stuipen", "epileptische aanval", "convulsies"], code: "P 1 Epileptische aanval" },
  { woorden: ["astma", "aanval", "benauwdheid", "ademhalingsproblemen", "kortademigheid", "benauwd"], code: "P 1 Ademnood" },
  { woorden: ["baby", "zuigeling", "kind", "nood", "niet ademen", "problemen"], code: "P 1 Kindernood" },

  // ☣️ Gevaarlijke stoffen en milieu
  { woorden: ["chemisch", "gevaarlijk", "stof", "gassen", "chemicaliën", "explosief", "brandbaar", "giftig", "corrosief"], code: "P 1 Gevaarlijke Stoffen" },
  { woorden: ["gas", "lekkage", "chemicaliën", "brandstof", "benzine", "diesel"], code: "P 1 Gaslekkage" },
  { woorden: ["explosie", "ontploffing"], code: "P 1 Explosie" },
  { woorden: ["storm", "wind", "hoosbui", "hagel", "ijzel"], code: "P 2 Weersschade" },
  { woorden: ["wateroverlast", "overstroming", "dijkdoorbraak"], code: "P 2 Wateroverlast" },

  // ❓ Onbekend
  { woorden: [], code: "P 1 Onbekende Melding" }
];
