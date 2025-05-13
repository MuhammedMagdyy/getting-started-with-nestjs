import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  transform(value: unknown, _metadata: ArgumentMetadata) {
    // Add here custom validation
    return value;
  }
}
