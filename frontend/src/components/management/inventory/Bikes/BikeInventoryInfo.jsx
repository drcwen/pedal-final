import { MdModeEditOutline } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { IoQrCode } from "react-icons/io5";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "../../../../lib/supabase";

function BikeInventoryInfo({
    bikeCode,
    bikeId,
    status,
    image,
    type,
    setBikeEdit,
    setFetchBikeCode,
    setFetchBikeId,
    setFetchBikeStatus,
    setFetchType,
    setFetchImage,
}) {
    const [openQr, setOpenQr] = useState(false);
    const [qrImage, setQrImage] = useState(null);
    const [loadingQr, setLoadingQr] = useState(false);
    const [replacingQr, setReplacingQr] = useState(false);
    const [qrError, setQrError] = useState("");

    const qrCanvasRef = useRef(null);

    // The actual URL encoded inside the QR code.
    const qrLink =
        typeof window !== "undefined"
            ? `${window.location.origin}/alerts/${bikeId}`
            : `/alerts/${bikeId}`;

    // Check whether this bike already has a saved QR image.
    useEffect(() => {
        if (!openQr || !bikeId) return;

        let cancelled = false;

        const loadQr = async () => {
            setLoadingQr(true);
            setQrError("");
            setQrImage(null);
            setReplacingQr(false);

            const { data, error } = await supabase
                .from("bikes_mod")
                .select("qr_code")
                .eq("id", bikeId)
                .maybeSingle();

            if (cancelled) return;

            if (error) {
                console.error("Error fetching bike QR:", error);
                setQrError("Failed to load the bike QR code.");
            } else if (data?.qr_code) {
                setQrImage(data.qr_code);
            } else {
                // No saved QR yet, so generate the first one.
                setReplacingQr(true);
            }

            setLoadingQr(false);
        };

        loadQr();

        return () => {
            cancelled = true;
        };
    }, [openQr, bikeId]);

    // Generate a QR image, upload it to Cloudinary, and save its URL.
    useEffect(() => {
        if (!openQr || !replacingQr || !bikeId) return;

        let cancelled = false;

        const generateAndSaveQr = async () => {
            setLoadingQr(true);
            setQrError("");

            try {
                // Allow React to render the QR canvas before reading it.
                await new Promise((resolve) => setTimeout(resolve, 100));

                const canvas = qrCanvasRef.current;

                if (!canvas) {
                    throw new Error("QR canvas is not ready.");
                }

                const cloudName =
                    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

                const uploadPreset =
                    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

                if (!cloudName || !uploadPreset) {
                    throw new Error(
                        "Configure your Cloudinary cloud name and upload preset."
                    );
                }

                const blob = await new Promise((resolve, reject) => {
                    canvas.toBlob((result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(new Error("Failed to create QR image."));
                        }
                    }, "image/png");
                });

                const formData = new FormData();

                formData.append("file", blob, `bike-${bikeId}-qr.png`);
                formData.append("upload_preset", uploadPreset);
                formData.append("folder", "bike-qr-codes");
                formData.append(
                    "public_id",
                    `bike-${bikeId}-${Date.now()}`
                );

                const uploadResponse = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                const uploadData = await uploadResponse.json();

                if (!uploadResponse.ok) {
                    throw new Error(
                        uploadData.error?.message ||
                            "Cloudinary upload failed."
                    );
                }

                const imageUrl = uploadData.secure_url;

                if (cancelled) return;

                // Save the Cloudinary image URL in bikes_mod.qr_code.
                const { error: updateError } = await supabase
                    .from("bikes_mod")
                    .update({ qr_code: imageUrl })
                    .eq("id", bikeId);

                if (updateError) {
                    throw updateError;
                }

                if (cancelled) return;

                setQrImage(imageUrl);
                setReplacingQr(false);
            } catch (error) {
                if (!cancelled) {
                    console.error("Error generating bike QR:", error);
                    setQrError(
                        error.message || "Failed to generate QR code."
                    );
                    setReplacingQr(false);
                }
            } finally {
                if (!cancelled) {
                    setLoadingQr(false);
                }
            }
        };

        generateAndSaveQr();

        return () => {
            cancelled = true;
        };
    }, [openQr, replacingQr, bikeId, qrLink]);

    const handleReplaceQr = () => {
        const confirmed = window.confirm(
            `Are you sure you want to regenerate the QR code for ${bikeCode}? The new QR image will replace the saved QR code in the database.`
        );

        if (confirmed) {
            setQrError("");
            setReplacingQr(true);
        }
    };

    const handleSaveQr = async () => {
        if (!qrImage) return;

        try {
            const response = await fetch(qrImage);

            if (!response.ok) {
                throw new Error("Failed to download the QR image.");
            }

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = imageUrl;
            link.download = `${bikeCode}-QR.png`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(imageUrl);
        } catch (error) {
            console.error("Error saving QR image:", error);
            setQrError("Failed to save the QR image. Please try again.");
        }
    };

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    console.log("Cloudinary configuration:", {
        cloudNameExists: Boolean(cloudName),
        uploadPresetExists: Boolean(uploadPreset),
    });

    if (!cloudName || !uploadPreset) {
        throw new Error(
            `Missing Cloudinary configuration: ${
                !cloudName ? "cloud name " : ""
            }${!uploadPreset ? "upload preset" : ""}`.trim()
        );
    }

    return (
        <>
            <div className="md:px-3 px-6 bg-[#ffffff] items-center border border-[#C9C9C9] rounded-lg py-2 flex flex-row justify-between md:grid md:grid-cols-[1fr_1fr_1fr_1fr_30px] gap-2 font-akagi font-bold text-gray text-md text-center">
                <div>{bikeCode}</div>

                <div className="hidden md:block">
                    12/22/2026
                </div>

                <div className="hidden md:flex justify-center">
                    <div
                        onClick={() => setOpenQr(true)}
                        className="p-1 px-2 bg-blue text-[#ffffff] cursor-pointer w-fit rounded-lg flex gap-2 items-center font-medium text-sm"
                    >
                        <IoQrCode className="text-md" />
                        View QR
                    </div>
                </div>

                <div>{status}</div>

                <div className="flex items-center justify-center">
                    <div
                        onClick={
                            status === "Under Maintenance" ||
                            status === "Rented"
                                ? undefined
                                : () => {
                                      setBikeEdit(true);
                                      setFetchBikeCode(bikeCode);
                                      setFetchBikeStatus(status);
                                      setFetchBikeId(bikeId);
                                      setFetchType(type);
                                      setFetchImage(image);
                                  }
                        }
                        className={`${
                            status === "Under Maintenance" ||
                            status === "Rented"
                                ? "opacity-50 bg-gray cursor-not-allowed"
                                : "bg-blue cursor-pointer"
                        } rounded-lg p-1`}
                    >
                        <MdModeEditOutline className="text-[#ffffff] text-lg" />
                    </div>
                </div>
            </div>

            {openQr && (
                <div
                    className="fixed inset-0 bg-black/50 flex justify-center items-center z-[100] p-5"
                    onClick={() => setOpenQr(false)}
                >
                    <div
                        className="bg-[#ffffff] p-5 md:p-7 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2] flex flex-col gap-5 font-akagi font-bold text-blue"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl">Bike QR Code</h1>

                            <button
                                onClick={() => setOpenQr(false)}
                                className="text-gray text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="lg:grid lg:grid-cols-2 flex flex-col gap-5">
                            {/* QR Code */}
                            <div className="w-full flex flex-col items-center justify-center gap-5 bg-gray/10 border border-gray/30 p-4 py-10 rounded-lg">
                                {loadingQr ? (
                                    <p>Generating / loading QR...</p>
                                ) : qrImage ? (
                                    <img
                                        src={qrImage}
                                        alt={`QR code for ${bikeCode}`}
                                        className="w-56 h-56 object-contain bg-[#ffffff] p-2 rounded-lg"
                                    />
                                ) : (
                                    <p className="text-center text-sm">
                                        {qrError || "QR code not available."}
                                    </p>
                                )}

                                {/* Keep the generated QR canvas available for upload. */}
                                <div className="absolute -left-[9999px] top-0 pointer-events-none">
                                    <QRCodeCanvas
                                        ref={qrCanvasRef}
                                        value={qrLink}
                                        size={512}
                                        level="H"
                                        includeMargin
                                    />
                                </div>

                                <div className="flex flex-row justify-center gap-3 flex-wrap">

                                    <div className="flex flex-row justify-center gap-3 flex-wrap">

                                        <button
                                            onClick={handleReplaceQr}
                                            disabled={loadingQr}
                                            className="border-2 border-gray/70 text-gray cursor-pointer px-4 py-2 rounded-lg disabled:opacity-50"
                                        >
                                            {loadingQr ? "Please wait..." : "Regenerate QR"}
                                        </button>

                                        <button
                                            onClick={handleSaveQr}
                                            disabled={loadingQr || !qrImage}
                                            className="bg-blue text-[#ffffff] px-4 py-2 cursor-pointer rounded-lg disabled:opacity-50"
                                        >
                                            Save Image
                                        </button>

                                    </div>

                                </div>

                                {qrError && (
                                    <p className="text-red-600 text-sm text-center">
                                        {qrError}
                                    </p>
                                )}
                            </div>

                            {/* Bike Information */}
                            <div className="flex flex-col gap-2">
                                <h2 className="text-lg">Bike Information</h2>

                                <div className="flex flex-col gap-1">
                                    <span className="text-gray text-sm">
                                        Bike Code
                                    </span>
                                    <p>{bikeCode}</p>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-gray text-sm">
                                        Bike ID
                                    </span>
                                    <p>{bikeId}</p>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-gray text-sm">
                                        Bike Type
                                    </span>
                                    <p>{type?.name ?? type ?? "—"}</p>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-gray text-sm">
                                        Status
                                    </span>
                                    <p>{status}</p>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-gray text-sm">
                                        QR Destination
                                    </span>

                                    <p className="text-sm break-all font-normal">
                                        {qrLink}
                                    </p>

                                    <button
                                        onClick={() =>
                                            navigator.clipboard.writeText(
                                                qrLink
                                            )
                                        }
                                        className="bg-blue text-white px-3 py-2 rounded-lg text-sm w-fit mt-2"
                                    >
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default BikeInventoryInfo;