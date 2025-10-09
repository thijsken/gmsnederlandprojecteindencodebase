// alarmcodes.js
window.alarmcodes = [
  // 🔥 Brandmeldingen
  { woorden: [ "brandalarm", "brandmelding", "woning", "huis", "gebouw", "pand"], code: "P1 BR (Woning)" },
  { woorden: [ "brandmelding", "auto", "voertuig", "bus", "truck"], code: "P1 BR (Voertuig)" },
  { woorden: [ "brandmelding", "bos", "natuur", "gras", "heide"], code: "P2 BR (Natuurbrand)" },
  { woorden: [ "brandmelding", "schuur", "loods", "schuurbrand"], code: "P1 BR (Schuur)" },
  { woorden: [ "brandmelding", "container", "vuilnisbak", "afvalbak", "afval", "afvalcontainer"], code: "P1 BR (Containerbrand)" },
  { woorden: [ "brandmelding", "fabriek", "industrie", "industrieterrein", "bedrijfspand", "bedrijf", "bedrijfsterrein", "industriegebied"], code: "P1 BR (Industrie)" },

  // 🚗 Ongevallen en trauma
  { woorden: ["ongeval", "trauma", "botsing", "aanrijding", "verkeersongeval", "auto", "voertuig", "bus", "truck", "motor", "brommer", "fatbike", "tram", "trein"], code: "P1 HV (Ongeval Wegverkeer)" },
  { woorden: ["val", "trap", "hoogte", "loods", "steiger", "dak", "gebouw", "pand", "hoogteval", "val van hoogte"], code: "P1 HV (Val van hoogte)" },
  { woorden: ["snijwond", "mes", "glas", "messteek", "steekwond"], code: "P1 Steekincident" },
  { woorden: ["hart", "hartstilstand", "hartaanval", "reanimatie", "reanimeren", "bewusteloos", "flauwte", "flauwvallen"], code: "P1 Reanimatie" },
  { woorden: ["schotwond", "wapen", "schieten"], code: "P1 Schietincident" },

  // 🏥 Medische noodsituaties
  { woorden: ["reanimatie", "hartstilstand", "bewusteloos", "noodmedische", "admeniet"], code: "P1 Reanimatie" },
  { woorden: ["beroerte", "hartaanval", "hartstilstand", "bewusteloos", "stroke", "hersenbloeding", "hartinfarct"], code: "P1 Medische Noodsituatie" },
  { woorden: ["epilepsie", "aanval", "stuip", "stuipen", "epileptische aanval", "convulsies"], code: "P1 Epileptische aanval" },
  { woorden: ["astma", "aanval", "benauwdheid", "ademhalingsproblemen", "kortademigheid", "benauwd"], code: "P1 Ademnood" },
  { woorden: ["baby", "zuigeling", "kind", "nood", "niet ademen", "problemen"], code: "P1 Kindernood" },

  // ☣️ Gevaarlijke stoffen en milieu
  { woorden: ["chemisch", "gevaarlijk", "stof", "gassen", "chemicaliën", "explosief", "brandbaar", "giftig", "corrosief"], code: "P1 Gevaarlijke Stoffen" },
  { woorden: ["gas", "lekkage", "chemicaliën", "brandstof", "benzine", "diesel"], code: "P1 Gaslekkage" },
  { woorden: ["explosie", "ontploffing"], code: "P1 Explosie" },
  { woorden: ["storm", "wind", "hoosbui", "hagel", "ijzel"], code: "P2 Weersschade" },
  { woorden: ["wateroverlast", "overstroming", "dijkdoorbraak"], code: "P2 Wateroverlast" },

  // ❓ Onbekend
  { woorden: [], code: "P1 Onbekende Melding" }
];
