import jsPDF from "jspdf";

export function printReceipt({
    transaction,
    startedBikes,
    maintenanceData,
    fullName,
    extensionsData,
    changeBikesData
}) {

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 200]
    });

    let y = 10;

    // ==========================================
    // HELPERS
    // ==========================================

    const centerText = (text, size = 9, bold = false) => {
        doc.setFontSize(size);
        doc.setFont("helvetica", bold ? "bold" : "normal");

        doc.text(
            String(text ?? "-"),
            40,
            y,
            { align: "center" }
        );

        y += size * 0.45 + 2;
    };

    const row = (label, value) => {
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");

        doc.text(String(label ?? "-"), 5, y);

        doc.text(
            String(value ?? "-"),
            75,
            y,
            { align: "right" }
        );

        y += 5;
    };

    const line = () => {
        doc.setDrawColor(180, 180, 180);
        doc.line(5, y, 75, y);
        y += 5;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";

        const date = new Date(`${dateString}T00:00:00`);

        return date.toLocaleDateString("en-PH", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    const formatTime12Hour = (time) => {
        if (!time) return "-";

        const [hours, minutes, seconds] =
            time.split(":").map(Number);

        const date = new Date();

        date.setHours(
            hours,
            minutes,
            seconds || 0
        );

        return date.toLocaleTimeString("en-PH", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    };

    const getEndTimePH = (range) => {
        if (!range) return "-";

        const endTimestamp = range
            .replace("[", "")
            .replace(")", "")
            .split(",")[1];

        if (!endTimestamp) return "-";

        const date = new Date(endTimestamp);

        return date.toLocaleTimeString("en-PH", {
            timeZone: "Asia/Manila",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    };

    const getStartTimePH = (range) => {
        if (!range) return "-";

        const startTimestamp = range
            .replace("[", "")
            .replace(")", "")
            .split(",")[0];

        if (!startTimestamp) return "-";

        const date = new Date(startTimestamp);

        return date.toLocaleTimeString("en-PH", {
            timeZone: "Asia/Manila",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    };

    const formatDatePH = (timestamp) => {
        if (!timestamp) return "-";

        return new Date(timestamp).toLocaleDateString(
            "en-PH",
            {
                timeZone: "Asia/Manila",
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );
    };

    const formatTimePH = (timestamp) => {
        if (!timestamp) return "-";

        return new Date(timestamp).toLocaleTimeString(
            "en-PH",
            {
                timeZone: "Asia/Manila",
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }
        );
    };

    // ==========================================
    // GROUP BIKES
    // ==========================================

    const groupedBikes = Object.values(
        (startedBikes ?? []).reduce((groups, bike) => {

            const key =
                `${bike.bike_type_id}-${bike.reservation_date}-${bike.start_time}`;

            if (!groups[key]) {

                groups[key] = {
                    ...bike,
                    quantity: 1
                };

            } else {

                groups[key].quantity += 1;

            }

            return groups;

        }, {})
    );

    // ==========================================
    // HEADER
    // ==========================================

    centerText("3Jremy's Rent A Bike!", 14, true);
    centerText(
        "La Mesa Eco Park, Quezon City",
        8,
        false
    );

    y += 3;

    // ==========================================
    // TRANSACTION INFORMATION
    // ==========================================

    row("Receipt No:", `#${transaction.id}`);

    row("Customer:", fullName);

    row("Type:", transaction.type);

    row(
        "Transaction Date:",
        formatDatePH(transaction.created_at)
    );

    row(
        "Transaction Time:",
        formatTimePH(transaction.created_at)
    );

    y += 2;

    line();

    // ==========================================
    // WALK-IN / RESERVATION
    // ==========================================

    if (
        transaction.type === "reservation" ||
        transaction.type === "walk-in" || 
        transaction?.type === undefined
    ) {

        for (const bike of groupedBikes) {

            const bikeName =
                bike.bike_types_mod?.name ??
                "Unknown Bike";

            const quantity = bike.quantity;

            const price =
                Number(bike.bike_types_mod?.price ?? 0);

            const total =
                price * quantity;

            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");

            doc.text(
                `${bikeName} x${quantity}`,
                5,
                y
            );

            doc.text(
                `P${total.toFixed(2)}`,
                75,
                y,
                { align: "right" }
            );

            y += 5;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);

            doc.text(
                formatDate(bike.reservation_date),
                5,
                y
            );

            y += 4;

            doc.text(
                `${formatTime12Hour(bike.start_time)} - ${getEndTimePH(bike.reservation_range)}`,
                5,
                y
            );

            y += 4;

            doc.text(
                bike.duration_hours === 1
                    ? "1 hour"
                    : `${bike.duration_hours} hours`,
                5,
                y
            );

            y += 7;
        }
    }

    // ==========================================
    // MAINTENANCE
    // ==========================================

    if (transaction.type === "maintenance") {

        const bikeType =
            maintenanceData
                ?.orders_mod
                ?.bikes_mod
                ?.bike_types_mod
                ?.name ?? "-";

        const bikeCode =
            maintenanceData
                ?.orders_mod
                ?.bikes_mod
                ?.code ?? "-";

        const reason =
            maintenanceData?.reason ?? "-";

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");

        doc.text(
            `${bikeType} ${bikeCode}`,
            5,
            y
        );

        doc.text(
            `P${transaction.total_amount}`,
            75,
            y,
            { align: "right" }
        );

        y += 5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);

        doc.text(
            reason,
            5,
            y
        );

        y += 5;

        doc.text(
            fullName,
            5,
            y
        );

        y += 7;
    }

    // ==========================================
    // EXTENSION
    // ==========================================

    if (transaction.type === "extend") {

        const bikeType =
            extensionsData
                ?.bike_types_mod
                ?.name ?? "-";

        const bikeCode =
            extensionsData
                ?.bikes_mod
                ?.code ?? "-";

        const extensionDuration =
            extensionsData?.extension_duration ?? 0;

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");

        doc.text(
            `${bikeType} ${bikeCode}`,
            5,
            y
        );

        doc.text(
            `P${transaction.total_amount}`,
            75,
            y,
            { align: "right" }
        );

        y += 5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);

        doc.text(
            `+${extensionDuration} ${
                extensionDuration === 1
                    ? "hour"
                    : "hours"
            }`,
            5,
            y
        );

        y += 4;

        doc.text(
            `${getStartTimePH(
                extensionsData?.new_reservation_range
            )} - ${getEndTimePH(
                extensionsData?.new_reservation_range
            )}`,
            5,
            y
        );

        y += 7;
    }

    // ==========================================
    // CHANGE BIKE
    // ==========================================

    if (transaction.type === "change") {

        const change = changeBikesData?.[0];

        // ------------------------------
        // ORIGINAL BIKE
        // ------------------------------

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");

        doc.text(
            "ORIGINAL BIKE",
            5,
            y
        );

        y += 5;

        doc.setFontSize(9);

        doc.text(
            `${change?.original_bike_type?.name ?? "-"} ${change?.original_bike?.code ?? "-"}`,
            5,
            y
        );

        y += 5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);

        doc.text(
            `${formatTime12Hour(
                change?.orders_mod?.start_time
            )} - ${getEndTimePH(
                change?.orders_mod?.reservation_range
            )}`,
            5,
            y
        );

        y += 7;

        // ------------------------------
        // CHANGED BIKE
        // ------------------------------

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);

        doc.text(
            "CHANGED BIKE",
            5,
            y
        );

        y += 5;

        doc.setFontSize(9);

        doc.text(
            `${change?.changed_bike_type?.name ?? "-"} ${change?.changed_bike?.code ?? "-"}`,
            5,
            y
        );

        doc.text(
            `P${transaction.total_amount}`,
            75,
            y,
            { align: "right" }
        );

        y += 5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);

        doc.text(
            `${formatTime12Hour(
                change?.orders_mod?.start_time
            )} - ${getEndTimePH(
                change?.orders_mod?.reservation_range
            )}`,
            5,
            y
        );

        y += 7;
    }

    // ==========================================
    // PAYMENT
    // ==========================================

    line();

    row(
        "Total:",
        `P${transaction.total_amount ?? 0}`
    );

    row(
        "Tendered Amount:",
        `P${transaction.amount_paid ?? 0}`
    );

    row(
        "Change:",
        `P${transaction.change_amount ?? 0}`
    );

    row(
        "Method:",
        transaction.payment_method
    );

    row(
        "Assisted by:",
        transaction?.assisted_by_profile?.full_name
    );

    // ==========================================
    // FOOTER
    // ==========================================

    y += 5;

    line();

    centerText(
        "Thank you for renting with us!",
        8,
        false
    );

    // ==========================================
    // PRINT
    // ==========================================

    doc.autoPrint();

    const pdfUrl = doc.output("bloburl");

    window.open(pdfUrl, "_blank");
}