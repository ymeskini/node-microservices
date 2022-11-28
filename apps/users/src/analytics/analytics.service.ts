import { ManagementClient } from 'auth0';
import { auth0 } from '../libs/auth0';

export class AnalyticsService {
  private auth0: ManagementClient;
  constructor() {
    this.auth0 = auth0;
  }

  getUserLogs = async (id: string) => {
    return this.auth0.getUserLogs({ id });
  };
}
