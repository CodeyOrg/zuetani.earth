import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

export interface UploadResult {
  url: string
  path: string
}

export class FirebaseStorageService {
  /**
   * Upload a file to Firebase Storage
   * @param file - The file to upload
   * @param path - The storage path (e.g., 'posts/image.jpg')
   * @returns Promise with download URL and storage path
   */
  static async uploadFile(file: File, path: string): Promise<UploadResult> {
    try {
      const storageRef = ref(storage, path)
      const snapshot = await uploadBytes(storageRef, file)
      const url = await getDownloadURL(snapshot.ref)
      
      return {
        url,
        path: snapshot.ref.fullPath
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      throw new Error('Failed to upload file')
    }
  }

  /**
   * Upload user avatar
   * @param file - The avatar image file
   * @param userId - The user's ID
   * @returns Promise with download URL and storage path
   */
  static async uploadAvatar(file: File, userId: string): Promise<UploadResult> {
    const fileName = `avatar_${Date.now()}.${file.name.split('.').pop()}`
    const path = `avatars/${userId}/${fileName}`
    return this.uploadFile(file, path)
  }

  /**
   * Upload post image
   * @param file - The image file
   * @param userId - The user's ID
   * @param postId - The post's ID (optional)
   * @returns Promise with download URL and storage path
   */
  static async uploadPostImage(file: File, userId: string, postId?: string): Promise<UploadResult> {
    const fileName = `image_${Date.now()}.${file.name.split('.').pop()}`
    const path = postId 
      ? `posts/${postId}/${fileName}`
      : `posts/${userId}/${fileName}`
    return this.uploadFile(file, path)
  }

  /**
   * Upload group image
   * @param file - The image file
   * @param groupId - The group's ID
   * @returns Promise with download URL and storage path
   */
  static async uploadGroupImage(file: File, groupId: string): Promise<UploadResult> {
    const fileName = `group_${Date.now()}.${file.name.split('.').pop()}`
    const path = `groups/${groupId}/${fileName}`
    return this.uploadFile(file, path)
  }

  /**
   * Delete a file from Firebase Storage
   * @param path - The storage path of the file to delete
   */
  static async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path)
      await deleteObject(storageRef)
    } catch (error) {
      console.error('Error deleting file:', error)
      throw new Error('Failed to delete file')
    }
  }

  /**
   * Get download URL for a file
   * @param path - The storage path
   * @returns Promise with download URL
   */
  static async getDownloadURL(path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path)
      return await getDownloadURL(storageRef)
    } catch (error) {
      console.error('Error getting download URL:', error)
      throw new Error('Failed to get download URL')
    }
  }

  /**
   * Validate file type and size
   * @param file - The file to validate
   * @param allowedTypes - Array of allowed MIME types
   * @param maxSizeInMB - Maximum file size in MB
   * @returns boolean indicating if file is valid
   */
  static validateFile(
    file: File, 
    allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxSizeInMB: number = 5
  ): { valid: boolean; error?: string } {
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      }
    }

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      return {
        valid: false,
        error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${maxSizeInMB}MB`
      }
    }

    return { valid: true }
  }

  /**
   * Create a unique filename
   * @param originalName - The original filename
   * @param prefix - Optional prefix for the filename
   * @returns A unique filename
   */
  static createUniqueFilename(originalName: string, prefix?: string): string {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = originalName.split('.').pop()
    const baseName = prefix ? `${prefix}_` : ''
    
    return `${baseName}${timestamp}_${randomString}.${extension}`
  }
}