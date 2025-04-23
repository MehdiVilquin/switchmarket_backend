const additiveController = require("../../controllers/additiveController");

// Mock du modèle Mongoose
jest.mock("../../models/additives", () => ({
  find: jest.fn(),
  findById: jest.fn(),
  aggregate: jest.fn(),
}));

// Helper pour créer une fausse réponse
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Helper pour créer une fausse requête
const mockRequest = (params = {}) => ({
  params: params,
});

describe("Test des additifs", () => {
  // Test simple : Récupérer tous les additifs
  describe("getAllAdditives", () => {
    it("doit nous donner la liste des additifs E101 et E110", async () => {
      // 1. On prépare nos faux additifs
      const additif1 = {
        tag: "en:e101",
        shortName: "E101",
        origin: "animal",
      };

      const additif2 = {
        tag: "en:e110",
        shortName: "E110",
        origin: "unknown",
      };

      const listeAdditifs = [additif1, additif2];

      // 2. On dit à Mongoose de renvoyer nos faux additifs
      require("../../models/additives").find.mockResolvedValue(listeAdditifs);

      // 3. On prépare une fausse requête et une fausse réponse
      const req = mockRequest();
      const res = mockResponse();

      // 4. On appelle notre fonction
      await additiveController.getAllAdditives(req, res);

      // 5. On vérifie que tout s'est bien passé
      // D'abord on vérifie que la fonction a bien été appelée
      expect(res.json).toHaveBeenCalled();

      // Ensuite on récupère ce qui a été envoyé
      const reponseAPI = res.json.mock.calls[0][0];

      // On vérifie que result est true
      expect(reponseAPI.result).toBe(true);

      // On vérifie qu'on a bien 2 additifs
      expect(reponseAPI.additives.length).toBe(2);

      // On vérifie les données du premier additif (E101)
      expect(reponseAPI.additives[0].tag).toBe("en:e101");
      expect(reponseAPI.additives[0].shortName).toBe("E101");
      expect(reponseAPI.additives[0].origin).toBe("animal");

      // On vérifie les données du deuxième additif (E110)
      expect(reponseAPI.additives[1].tag).toBe("en:e110");
      expect(reponseAPI.additives[1].shortName).toBe("E110");
      expect(reponseAPI.additives[1].origin).toBe("unknown");
    });
  });

  // Test simple : Récupérer des additifs aléatoires
  describe("getRandomAdditives", () => {
    it("doit nous donner des additifs au hasard", async () => {
      // 1. On prépare nos faux additifs
      const additif1 = {
        tag: "en:e101",
        shortName: "E101",
        origin: "animal",
      };

      const additif2 = {
        tag: "en:e110",
        shortName: "E110",
        origin: "unknown",
      };

      const listeAdditifs = [additif1, additif2];

      // 2. On dit à Mongoose de renvoyer nos faux additifs
      require("../../models/additives").aggregate.mockResolvedValue(
        listeAdditifs
      );

      // 3. On prépare une fausse requête et une fausse réponse
      const req = mockRequest();
      const res = mockResponse();

      // 4. On appelle notre fonction
      await additiveController.getRandomAdditives(req, res);

      // 5. On vérifie que tout s'est bien passé
      // D'abord on vérifie que la fonction a bien été appelée
      expect(res.json).toHaveBeenCalled();

      // Ensuite on récupère ce qui a été envoyé
      const reponseAPI = res.json.mock.calls[0][0];

      // On vérifie que result est true
      expect(reponseAPI.result).toBe(true);

      // On vérifie qu'on a bien 2 additifs
      expect(reponseAPI.additives.length).toBe(2);

      // On vérifie les données du premier additif (E101)
      expect(reponseAPI.additives[0].tag).toBe("en:e101");
      expect(reponseAPI.additives[0].shortName).toBe("E101");
      expect(reponseAPI.additives[0].origin).toBe("animal");

      // On vérifie les données du deuxième additif (E110)
      expect(reponseAPI.additives[1].tag).toBe("en:e110");
      expect(reponseAPI.additives[1].shortName).toBe("E110");
      expect(reponseAPI.additives[1].origin).toBe("unknown");
    });
  });
});
