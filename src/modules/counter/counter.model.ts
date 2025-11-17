import mongoose, { Document, Schema } from 'mongoose';

export interface ICounter extends Document {
  _id: string; // Format: 'wardrobe_<userId>'
  seq: number;
  type:string;
}

const counterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
  type: { type: String, required: true }
});

const Counter = mongoose.model<ICounter>('Counter', counterSchema);

export const getNextSequence = async (userId: string,type:string): Promise<number> => {
  const counterId = `wardrobe_${userId}`;
  const counter = await Counter.findOneAndUpdate(
    { _id:counterId,type:type },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return counter.seq;
};

export default Counter;
