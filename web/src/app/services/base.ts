import {environment} from "../../environments/environment";

export abstract class BaseService {
  protected readonly API_HOST = environment.API_HOST;
}
