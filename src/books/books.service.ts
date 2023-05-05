import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createBookDto: CreateBookDto) {
    const { booktags } = createBookDto;

    const result = await this.prisma.books.create({
      data: {
        genre: createBookDto.genre,
        title: createBookDto.title,
        price: createBookDto.price,
        quantity: createBookDto.quantity,
        authors: {
          connect: { id: createBookDto.authorId },
        },
        BookTags: {
          createMany: {
            data: booktags.map((booktag) => ({
              tagid: booktag,
            })),
          },
        },
      },
    });

    return result;
  }

  async findAll(limit: number, page: number) {
    const skip: number = (page - 1) * limit;
    const take: number = +limit;

    const query: Prisma.BooksFindManyArgs = {
      skip,
      take,
      include: { authors: true, BookTags: { include: { tags: true } } },
      orderBy: { id: 'desc' },
    };

    const [books, count] = await this.prisma.$transaction([
      this.prisma.books.findMany(query),
      this.prisma.books.count({ where: query.where }),
    ]);

    return {
      pagination: {
        total: count,
        page: +page,
        limit: +limit,
      },
      data: books,
    };
  }

  findOne(id: number) {
    return this.prisma.books.findUnique({
      where: { id },
      include: { authors: true, BookTags: { include: { tags: true } } },
    });
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return this.prisma.books.update({
      where: { id },
      data: {
        genre: updateBookDto.genre,
        title: updateBookDto.title,
        price: updateBookDto.price,
        quantity: updateBookDto.quantity,
        authors: {
          connect: { id: updateBookDto.authorId },
        },
        BookTags: {
          createMany: {
            data: updateBookDto.booktags.map((booktag) => ({
              tagid: booktag,
            })),
            skipDuplicates: true,
          },
          deleteMany: {
            tagid: {
              notIn: updateBookDto.booktags,
            },
          },
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.books.delete({ where: { id } });
  }

  async search(limit: number, page: number, q: string) {
    const skip: number = (page - 1) * limit;
    const take: number = +limit;

    const query: Prisma.BooksFindManyArgs = {
      skip,
      take,
      where: {
        OR: [
          {
            authors: { name: { contains: q, mode: 'insensitive' } },
          },
          {
            BookTags: {
              some: { tags: { name: { contains: q, mode: 'insensitive' } } },
            },
          },
        ],
      },
      include: { authors: true, BookTags: { include: { tags: true } } },
      orderBy: { id: 'desc' },
    };

    const [books, count] = await this.prisma.$transaction([
      this.prisma.books.findMany(query),
      this.prisma.books.count({ where: query.where }),
    ]);

    return {
      pagination: {
        total: count,
        page: +page,
        limit: +limit,
      },
      data: books,
    };
  }
}
