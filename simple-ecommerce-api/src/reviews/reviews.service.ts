import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

type Review = {
  id: number;
  productId: number;
  rating: number;
  comment: string;
};

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  private reviews: Review[] = [
    { id: 1, productId: 1, rating: 5, comment: 'Excellent product!' },
    { id: 2, productId: 2, rating: 4, comment: 'Very good quality.' },
    { id: 3, productId: 3, rating: 3, comment: 'Average experience.' },
  ];

  findAll(): Review[] {
    return this.reviews;
  }
}
