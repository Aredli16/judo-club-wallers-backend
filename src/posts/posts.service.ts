import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { getFirestore } from 'firebase-admin/firestore';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  async create(createPostDto: CreatePostDto) {
    try {
      const response = await getFirestore()
        .collection('posts')
        .add({
          ...createPostDto,
          date_posted: new Date(),
        });
      return {
        response: 'Successfully added',
        data: {
          id: response.id,
          ...createPostDto,
          date_posted: new Date(),
        },
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  }

  async findAll(): Promise<Post[]> {
    return await this.getAllPost();
  }

  async findAllByType(type: string) {
    try {
      const posts: Post[] = [];
      (
        await getFirestore().collection('posts').where('type', '==', type).get()
      ).docs.map((data) => {
        posts.push({ id: data.id, ...(data.data() as Post) });
      });
      return posts;
    } catch (error) {
      return { error: error };
    }
  }

  async findImportantByType(type, count) {
    try {
      const posts: Post[] = [];
      (
        await getFirestore()
          .collection('posts')
          .where('type', '==', type)
          .where('important', '==', true)
          .get()
      ).docs.map((data) => {
        posts.push({ id: data.id, ...(data.data() as Post) });
      });
      return posts;
    } catch (error) {
      return { error: error };
    }
  }

  async findOne(id: string): Promise<Post> {
    const response = await getFirestore().collection('posts').doc(id).get();
    return { id: response.id, ...(response.data() as Post) };
  }

  async findPopular(count: number) {
    let posts: Post[] = await this.getAllPost();
    posts = posts.filter((post) => post.likes); // Delete not liked posts
    posts = posts.sort((a, b) => b.likes - a.likes); // Sorting from most liked to least liked
    posts.splice(count); // Get only count
    return posts;
  }

  async findMostViewed(count: number) {
    let posts: Post[] = await this.getAllPost();
    posts = posts.filter((post) => post.views); // Delete not viewed posts
    posts = posts.sort((a, b) => b.views - a.views); // Sorting from most viewed to least viewed
    posts.splice(count); // Get only count
    return posts;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      await getFirestore()
        .collection('posts')
        .doc(id)
        .update({ ...updatePostDto });
      return {
        response: 'Successfully update',
      };
    } catch (e) {
      return { error: e };
    }
  }

  async remove(id: string) {
    try {
      await getFirestore().collection('posts').doc(id).delete();
      return {
        response: 'Successfully delete',
      };
    } catch (e) {
      return { error: e };
    }
  }

  async getAllPost(): Promise<Post[]> {
    const posts: Post[] = [];
    (await getFirestore().collection('posts').get()).docs.map((data) => {
      posts.push({
        id: data.id,
        ...(data.data() as Post),
      });
    });
    return posts;
  }
}
