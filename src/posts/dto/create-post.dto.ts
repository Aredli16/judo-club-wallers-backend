export class CreatePostDto {
  readonly title: string;
  readonly subtitle: string;
  readonly content: string;
  readonly author: string;
  readonly type: string;
  readonly important: boolean;
}
