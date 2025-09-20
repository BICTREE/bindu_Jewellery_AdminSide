import React from 'react';
import { FiPlus, FiX, FiUpload } from 'react-icons/fi';
import { uploadMultipleFiles } from '../../services/uploadService';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const MultiImageUploader = ({ images, setImages }) => {
    const axiosPrivate = useAxiosPrivate()
    const handleImageAdd = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;

        input.onchange = async (e) => {
            const files = Array.from(e.target.files);

            const data = await uploadMultipleFiles(axiosPrivate, files)

            if(data.success){
                const upImgs = data?.data?.files;
                setImages([...images, ...upImgs])
            }
        };

        input.click();
    };

    const handleImageRemove = (index) => {
        const nimgs = images?.filter((_, i) => i !== index)
        setImages(nimgs);
    };

    return (
        <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-neutral-900">Product Images</h2>
                <button type="button" onClick={handleImageAdd} className="btn btn-secondary btn-sm">
                    <FiPlus className="mr-1 h-4 w-4" />
                    Add Image
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {images.length > 0 ? (
                    images.map((image, index) => (
                        <div key={index} className="relative group">
                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-neutral-200">
                                <img
                                    src={image?.location}
                                    alt={`Product image ${index + 1}`}
                                    className="h-40 w-full object-cover object-center"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleImageRemove(index)}
                                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white bg-opacity-75 text-error-500 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FiX className="h-5 w-5" />
                                </button>
                            </div>
                            {index === 0 && (
                                <span className="absolute top-2 left-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                                    Primary
                                </span>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full">
                        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <FiUpload className="mx-auto h-12 w-12 text-neutral-400" />
                                <div className="flex text-sm text-neutral-600">
                                    <button
                                        type="button"
                                        onClick={handleImageAdd}
                                        className="relative font-medium text-primary-600 hover:text-primary-500 focus:outline-none"
                                    >
                                        Add product images
                                    </button>
                                </div>
                                <p className="text-xs text-neutral-500">PNG, JPG, GIF up to 5MB</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultiImageUploader;
