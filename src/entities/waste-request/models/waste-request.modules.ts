import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WasteRequestDocument = WasteRequest & Document;

@Schema({ timestamps: true })
export class WasteRequest {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: false })
  companyId?: Types.ObjectId; // assigned company (optional)

  @Prop({ required: true })
  wasteType: string; // e.g. plastic, metal, organic, e-waste

  @Prop({ required: true })
  quantity: number; // in KG or number of bags

  @Prop({ required: true })
  pickupAddress: string;

  @Prop({ default: 'pending', enum: ['pending', 'accepted', 'completed', 'cancelled'] })
  status: string;

  @Prop({ default: null })
  pickupDate?: Date; // selected date by user

  @Prop({ default: null })
  completionDate?: Date;

  @Prop({ default: null })
  notes?: string; // optional notes by user or company
}

export const WasteRequestSchema = SchemaFactory.createForClass(WasteRequest);
