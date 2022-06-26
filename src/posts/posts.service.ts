import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { getFirestore } from 'firebase-admin/firestore';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  async create(createPostDto: CreatePostDto): Promise<string> {
    try {
      const response = await getFirestore()
        .collection('posts')
        .add({
          ...createPostDto,
          date_posted: new Date(),
        });
      return `Added successfully with id ${response.id}`;
    } catch (error) {
      return error;
    }
  }

  async findAll(): Promise<Post[]> {
    return await this.getAllPost();
  }

  async findAllByType(
    type: string,
    important?: boolean,
    count?: number,
  ): Promise<Post[]> {
    let posts: Post[] = [];
    const postType = getFirestore()
      .collection('posts')
      .where('type', '==', type);
    if (important) {
      (await postType.where('important', '==', true).get()).docs.map((data) => {
        posts.push({
          id: data.id,
          ...(data.data() as Post),
          date_posted: data.get('date_posted').toDate(),
        });
      });
    } else {
      (await postType.get()).docs.map((data) => {
        posts.push({
          id: data.id,
          ...(data.data() as Post),
          date_posted: data.get('date_posted').toDate(),
        });
      });
    }
    if (important) posts.splice(count);
    posts = this.sortTabByDateAsc(posts);
    return posts;
  }

  async findOne(id: string): Promise<Post> {
    const response = await getFirestore().collection('posts').doc(id).get();
    return {
      id: response.id,
      ...(response.data() as Post),
      date_posted: response.get('date_posted').toDate(),
    };
  }

  async findPopular(count: number): Promise<Post[]> {
    let posts: Post[] = await this.getAllPost();
    posts = posts.filter((post) => post.likes); // Delete not liked posts
    posts = posts.sort((a, b) => b.likes - a.likes); // Sorting from most liked to least liked
    posts.splice(count); // Get only count
    return posts;
  }

  async findMostViewed(count: number): Promise<Post[]> {
    let posts: Post[] = await this.getAllPost();
    posts = posts.filter((post) => post.views); // Delete not viewed posts
    posts = posts.sort((a, b) => b.views - a.views); // Sorting from most viewed to least viewed
    posts.splice(count); // Get only count
    return posts;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<string> {
    try {
      await getFirestore()
        .collection('posts')
        .doc(id)
        .update({ ...updatePostDto });
      return `Successfully update ${id}`;
    } catch (e) {
      return e;
    }
  }

  async remove(id: string): Promise<string> {
    try {
      await getFirestore().collection('posts').doc(id).delete();
      return `Successfully delete ${id}`;
    } catch (e) {
      return e;
    }
  }

  async getAllPost(): Promise<Post[]> {
    let posts: Post[] = [];
    (await getFirestore().collection('posts').get()).docs.map((data) => {
      posts.push({
        id: data.id,
        ...(data.data() as Post),
        date_posted: data.get('date_posted').toDate(),
      });
    });
    posts = this.sortTabByDateAsc(posts);
    return posts;
  }

  sortTabByDateAsc(tab: Post[]): Post[] {
    return tab.sort((a, b) => b.date_posted - a.date_posted);
  }
}
