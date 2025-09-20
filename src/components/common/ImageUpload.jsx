import { useRef } from 'react';
import { FiUpload } from 'react-icons/fi';

function ImageUpload({ handleImageChange, kind }) {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            {
                kind === 'change'
                    ?
                    <>
                        <button
                            type="button"
                            onClick={handleClick}
                            className="mt-2 btn btn-secondary btn-sm"
                        >
                            Change Image
                        </button>

                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/gif"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                    </>
                    :
                    <div className="flex justify-center p-6 border-2 border-neutral-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <FiUpload className="mx-auto h-12 w-12 text-neutral-400" />
                            <div className="flex text-sm text-neutral-600">
                                <button
                                    type="button"
                                    onClick={handleClick}
                                    className="relative font-medium text-primary-600 hover:text-primary-500 focus:outline-none"
                                >
                                    Upload an image
                                </button>
                            </div>
                            <p className="text-xs text-neutral-500">PNG, JPG, GIF up to 5MB</p>
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/gif"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>
            }
        </>
    );
}

export default ImageUpload;
