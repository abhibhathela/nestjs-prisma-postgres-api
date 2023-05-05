import { Books } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';

export class Book implements Books {
  id: number;
  genre: string;
  price: Decimal;
  quantity: number;
  title: string;
  authorId: number;
}
