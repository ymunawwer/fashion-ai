import config from '../../config/config';

export enum LoyaltyEventType {
  WARDROBE_ADDED = 'MODORA_WARDROBE_ADDED',
  OUTFIT_ADDED = 'MODORA_OUTFIT_ADDED',
  MIRROR_SELFIE_ADDED = 'MODORA_MIRROR_SELFIE_ADDED',
  CUSTOM = 'MODORA_CUSTOM',
  INVITE = 'MODORA_INVITE',
  USER_REGISTER = 'MODORA_USER_REGISTER',
}

interface LoyaltyEventData {
  eventType: LoyaltyEventType;
  referenceId: string;
}

export class LoyaltyService {
  static async earnEvent(data: LoyaltyEventData, userId: string): Promise<void> {
    try {
      if (!config.loyalty.apiUrl || !config.loyalty.licenseKey) {
        console.log('Loyalty API not configured, skipping loyalty event');
        return;
      }

      const url = `${config.loyalty.apiUrl}/api/v1/loyalty/earn/event`;

      const payload = {
        eventType: data.eventType,
        referenceId: data.referenceId,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-license-key': config.loyalty.licenseKey,
          'x-id': userId,
          'x-app-id': config.loyalty.appId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Loyalty API error:', response.status, errorText);
      } else {
        console.log('Loyalty event sent successfully:', data.eventType, data.referenceId);
      }
    } catch (error: any) {
      console.error('Failed to send loyalty event:', error.message);
    }
  }

  static async trackWardrobeAdded(wardrobeId: string, userId: string): Promise<void> {
    await this.earnEvent(
      {
        eventType: LoyaltyEventType.WARDROBE_ADDED,
        referenceId: wardrobeId,
      },
      userId
    );
  }

  static async trackOutfitAdded(outfitId: string, userId: string): Promise<void> {
    await this.earnEvent(
      {
        eventType: LoyaltyEventType.OUTFIT_ADDED,
        referenceId: outfitId,
      },
      userId
    );
  }
}

export default LoyaltyService;
