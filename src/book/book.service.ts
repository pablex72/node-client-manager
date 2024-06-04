import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import mongoose from 'mongoose';
import{ Query } from 'express-serve-static-core'
import { title } from 'process';


@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async findAll(query: Query): Promise<Book[]> {


    // searching 
    //console.log(query)
    const keyword = query.keyword ? {
        title:{
            $regex: query.keyword,
            $options: 'i'
        },
    }:{};

    const books = await this.bookModel.find({ ...keyword });
    return books;
  }

  async create(book: Book): Promise<Book> {
    const res = await this.bookModel.create(book);
    return res;
  }

  async findById(id: String): Promise<Book> {
    const book = await this.bookModel.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async updateById(id: String, book: Book): Promise<Book> {
    return await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: String): Promise<Book> {
    return await this.bookModel.findByIdAndDelete(id);
  }
}
