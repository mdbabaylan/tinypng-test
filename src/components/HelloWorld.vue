<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6">
        <v-file-input v-model="file" label="Choose an image" prepend-icon="mdi-camera"
          @change="compressAndUploadImage"></v-file-input>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-img :src="uploadedImageUrl"></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
// import AWS from 'aws-sdk';


// Create an axios instance without the Content-Type header
const instance = axios.create();

instance.defaults.headers.common = {};

export default {
  data() {
    return {
      file: null,
      uploadedImageUrl: null
    };
  },
  methods: {
    async compressAndUploadImage() {
      if (!this.file) return;

      // Step 1: Compress the image using TinyPNG
      const compressedImage = await this.compressImage(this.file);

      // Step 2: Upload the compressed image to S3
      if (compressedImage) {
        this.uploadToS3(compressedImage);
      }
    },

    async compressImage(file) {
      // const formData = new FormData();
      // formData.append('file', file);
      console.log(file.type);

      try {

        //peskt CORS error, refer to vue.config.js
        const response = await instance.post('/shrink', file, {
          'Content-Type': file.type // 'image/png' or 'image/jpeg', for example
        });

        if (response.data && response.data.output && response.data.output.url) {
          // Download the compressed image

          const tinyUrl = response.data.output.url; // The original URL from TinyPNG

          //remove 'https://api.tinify.com' to the proxy takes over
          const localUrl = tinyUrl.replace('https://api.tinify.com/output/', '/output/');
          console.log(localUrl);
          const compressedImageResponse = await instance.get(localUrl, {
            responseType: 'blob'
          });
          return new File([compressedImageResponse.data], file.name, { type: file.type });
        }
      } catch (error) {
        console.error('Error compressing image:', error);
      }
      return null;
    },

  }
};
</script>
