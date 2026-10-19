
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    X,
    ChevronLeft,
    ChevronRight,
    Maximize2,
} from "lucide-react";

function GallerySection({
    imageItems = [],
    title = "Our Gallery",
    description = "Explore our collection.",
}) {
    const [selectedImage, setSelectedImage] = useState(null);

    const [currentIndex, setCurrentIndex] = useState(0);

    const openImage = (image, index) => {
        setSelectedImage(image);
        setCurrentIndex(index);
    };

    const closeImage = () => {
        setSelectedImage(null);
    };

    const previousImage = (e) => {
        e?.stopPropagation();

        const newIndex =
            currentIndex === 0
                ? imageItems.length - 1
                : currentIndex - 1;

        setCurrentIndex(newIndex);
        setSelectedImage(imageItems[newIndex]);
    };

    const nextImage = (e) => {
        e?.stopPropagation();

        const newIndex =
            currentIndex === imageItems.length - 1
                ? 0
                : currentIndex + 1;

        setCurrentIndex(newIndex);
        setSelectedImage(imageItems[newIndex]);
    };

    return (
        <section className="w-full overflow-hidden bg-darkblue py-16">

            {/* Header */}
            <div className="mx-auto mb-10 max-w-7xl px-6">

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="font-akagi font-black tracking-wide text-yellow text-4xl"
                >
                    {title}
                </motion.h2>

            </div>

            {/* Gallery */}
            <div className="mx-auto max-w-7xl px-6 pb-4">

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-8
                        md:grid-cols-4
                        md:auto-rows-[200px]
                    "
                >

                    {imageItems.map((item, index) => (
                        <motion.button
                            key={item.id ?? index}
                            type="button"
                            onClick={() => openImage(item, index)}
                            initial={{
                                opacity: 0,
                                scale: 0.95,
                            }}
                            whileInView={{
                                opacity: 1,
                                scale: 1,
                            }}
                            viewport={{
                                once: true,
                                amount: 0.2,
                            }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.05,
                            }}
                            whileHover={{
                                scale: 1.015,
                            }}
                            className={`
                                group
                                relative
                                h-[260px]
                                overflow-hidden
                                rounded-lg
                                shadow-xl
                                text-left


                                md:h-auto
                                ${item.span || ""}
                            `}
                        >

                            {/* Image */}
                            <img
                                src={item.url}
                                alt={item.title || "Gallery image"}
                                draggable="false"
                                className="
                                    absolute
                                    inset-0
                                    h-full
                                    w-full
                                    object-cover
                                    transition-transform
                                    duration-700
                                    group-hover:scale-110
                                "
                            />

                            {/* Gradient */}
                            <div
                                className="
                                    absolute
                                    inset-0
                                    bg-gradient-to-t
                                    from-black/75
                                    via-black/10
                                    to-transparent
                                    opacity-80
                                "
                            />

                            {/* Expand icon */}
                            <div
                                className="
                                    absolute
                                    right-4
                                    top-4
                                    rounded-full
                                    bg-white/20
                                    p-2
                                    text-white
                                    opacity-0
                                    backdrop-blur-md
                                    transition
                                    duration-300
                                    group-hover:opacity-100
                                "
                            >
                                <Maximize2 size={18} />
                            </div>

                        </motion.button>
                    ))}

                </div>
            </div>


            {/* Fullscreen modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="
                            fixed
                            inset-0
                            z-[999]
                            flex
                            items-center
                            justify-center
                            bg-black/90
                            p-4
                            backdrop-blur-sm
                        "
                        onClick={closeImage}
                    >

                        {/* Close */}
                        <button
                            type="button"
                            onClick={closeImage}
                            className="
                                absolute
                                right-5
                                top-5
                                z-20
                                rounded-full
                                bg-white/10
                                p-3
                                text-white
                                transition
                                hover:bg-white/20
                            "
                        >
                            <X size={24} />
                        </button>

                        {/* Previous */}
                        <button
                            type="button"
                            onClick={previousImage}
                            className="
                                absolute
                                left-4
                                top-1/2
                                z-20
                                -translate-y-1/2
                                rounded-full
                                bg-white/10
                                p-3
                                text-white
                                backdrop-blur-md
                                transition
                                hover:bg-white/20
                                md:left-8
                            "
                        >
                            <ChevronLeft size={28} />
                        </button>

                        {/* Image */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.9,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.9,
                            }}
                            transition={{
                                duration: 0.25,
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="
                                relative
                                flex
                                max-h-[90vh]
                                max-w-[90vw]
                                flex-col
                                items-center
                            "
                        >
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.title || "Gallery image"}
                                className="
                                    max-h-[75vh]
                                    max-w-full
                                    rounded-xl
                                    object-contain
                                    shadow-2xl
                                "
                            />

                            <div className="mt-4 text-center text-white">
                                <h3 className="font-akagi text-2xl font-bold">
                                    {selectedImage.title}
                                </h3>

                                {selectedImage.desc && (
                                    <p className="mt-1 text-white/70">
                                        {selectedImage.desc}
                                    </p>
                                )}
                            </div>
                        </motion.div>

                        {/* Next */}
                        <button
                            type="button"
                            onClick={nextImage}
                            className="
                                absolute
                                right-4
                                top-1/2
                                z-20
                                -translate-y-1/2
                                rounded-full
                                bg-white/10
                                p-3
                                text-white
                                backdrop-blur-md
                                transition
                                hover:bg-white/20
                                md:right-8
                            "
                        >
                            <ChevronRight size={28} />
                        </button>

                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
}

export default GallerySection;

