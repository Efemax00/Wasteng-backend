// src/company/dto/update-settings.dto.ts
export class UpdateCompanySettingsDto {
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  licenseNumber?: string;
  taxId?: string;
  
  // Operational settings
  operatingHours?: string;
  workingDays?: string;
  responseTime?: string;
  serviceRadius?: string;
  minCollection?: string;
}

// src/company/dto/notification-settings.dto.ts
export class NotificationSettingsDto {
  emailNotifications: boolean;
  smsNotifications: boolean;
  newRequests: boolean;
  statusUpdates: boolean;
  weeklyReports: boolean;
  systemAlerts: boolean;
}