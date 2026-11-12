import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PostsService } from '../../../../core/services/posts.service';

@Component({
  selector: 'app-create-post',
  imports: [ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent {
  private readonly postsService = inject(PostsService);

  @Output() postCreated = new EventEmitter<void>();

  saveFile!: File;
  imgUrl: string | null = null;
  content:FormControl = new FormControl('');
  privacy:FormControl = new FormControl('public');

  changeImage(e: Event): void {

    const input = e.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {

      this.saveFile = input.files[0];

      const fileReader = new FileReader();

      fileReader.readAsDataURL(this.saveFile);

      fileReader.onload = () => {
        this.imgUrl = fileReader.result as string;
      };
    }
  }

  removeImage(): void {
    this.saveFile = undefined as any;
    this.imgUrl = null;
  }

  onSubmit(e:SubmitEvent): void {
    e.preventDefault();
    const formData = new FormData();
    if(this.saveFile) {
      formData.append('image', this.saveFile);
    }
    if(this.content.value) {
      formData.append('body', this.content.value);
    }
    if(this.privacy.value) {
      formData.append('privacy', this.privacy.value);
    }


    this.postsService.createPost(formData).subscribe({
      next: (res) => {
        if(res.success) {
          this.postCreated.emit();
        }
        this.content.reset();
        this.privacy.reset('public');
        this.removeImage();
      },
      error: (err) => {
        console.log(err);
      }
    });


  }





}
