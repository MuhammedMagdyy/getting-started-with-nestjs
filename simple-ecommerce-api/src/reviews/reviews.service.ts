import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { UserType } from 'src/users/enums/user-type.enum';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    productId: number,
    userId: number,
  ) {
    const product = await this.productsService.findOne(productId);
    const user = await this.usersService.getCurrentUser(userId);

    const review = this.reviewRepository.create({
      ...createReviewDto,
      product,
      user,
    });

    const savedReview = await this.reviewRepository.save(review);

    return {
      id: savedReview.id,
      rating: savedReview.rating,
      comment: savedReview.comment,
      productId: savedReview.product.id,
      userId: savedReview.user.id,
      createdAt: savedReview.createdAt,
      updatedAt: savedReview.updatedAt,
    };
  }

  async findAll(pageNumber: number, pageSize: number) {
    return await this.reviewRepository.find({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  async update(id: number, userId: number, updateReviewDto: UpdateReviewDto) {
    const review = await this.findOne(id);

    if (review.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this review',
      );
    }

    review.rating = updateReviewDto.rating ?? review.rating;
    review.comment = updateReviewDto.comment ?? review.comment;

    const updatedReview = await this.reviewRepository.save(review);

    return {
      id: updatedReview.id,
      rating: updatedReview.rating,
      comment: updatedReview.comment,
      productId: updatedReview.product.id,
      userId: updatedReview.user.id,
      createdAt: updatedReview.createdAt,
      updatedAt: updatedReview.updatedAt,
    };
  }

  async delete(id: number, userId: number) {
    const review = await this.findOne(id);

    if (review.user.id !== userId && review.user.userType !== UserType.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to delete this review',
      );
    }

    await this.reviewRepository.remove(review);
    return { message: 'Review deleted successfully' };
  }
}
