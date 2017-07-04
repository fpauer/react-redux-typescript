export interface ProfilePhotosPropsInterface {
	imagesAdded: (images: any[]) => void
	imageDeleted: (image: any) => void
	destination: any[]
}