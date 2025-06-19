import { ContactListAPI } from "./contactListApi";
import { MarketingController } from "./marketingController";
import { marketingErrorHandler } from "./marketingErrors";
import { MarketingService } from "./marketingService";
import { WebServer } from "../../shared/webServer";

export class MarketingModule {
  private readonly contactListAPI: ContactListAPI;
  private readonly marketingService: MarketingService;
  private readonly marketingController: MarketingController;

  private constructor() {
    this.contactListAPI = this.createContactListAPI();
    this.marketingService = this.createMarketingService();
    this.marketingController = this.createMarketingController();
  }

  public static build(): MarketingModule {
    return new MarketingModule();
  }

  private createContactListAPI(): ContactListAPI {
    return ContactListAPI.build();
  }

  createMarketingService(): MarketingService {
    return new MarketingService(this.contactListAPI);
  }

  createMarketingController(): MarketingController {
    return new MarketingController(
      this.marketingService,
      marketingErrorHandler
    );
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/marketing", this.marketingController.getRouter());
  }
}
