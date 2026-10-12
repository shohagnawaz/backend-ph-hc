import PDFDocument from "pdfkit";

interface PrescriptionData {
    doctorName: string;
    doctorEmail: string;
    patientName: string;
    patientEmail: string;
    followUpDate: Date;
    instructions: string;
    prescriptionId: string;
    appointmentDate: Date;
    createdAt: Date
}

export const generatePrescriptionPDF = async (prescriptionData : PrescriptionData): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: "A4",
                margin: 50
            });

            const chunks : Buffer[] = [];

            doc.on("data", (chunk) => {
                chunks.push(chunk);
            });

            doc.on("end", () => {
                resolve(Buffer.concat(chunks));
            });

            doc.on("error", (err) => {
                reject(err);
            });
            // Title
            doc.fontSize(24).font("Helvetica-Bold").text("Prescription", {
                align: "center"
            });

            doc.moveDown(0.5);

            doc
            .fontSize(10)
            .font("Helvetica")
            .text("PH Healthcare Service", {
                align: "center"
            });

            doc.text("Welcome to PH Healthcare Service. We are committed to providing you with the best healthcare experience possible.", {
                align: "center"
            });

            doc.moveDown(1);

            // Horizontal Line
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();

            doc.moveDown(1);

            // Doctor Information
            doc
            .fontSize(11)
            .font("Helvetica-Bold")
            .font("Doctor Information");

            doc
            .fontSize(10)
            .font("Helvetica")
            .text(`Name: ${prescriptionData.doctorName}`)
            .text(`Email: ${prescriptionData.doctorEmail}`);

            doc.moveDown(0.8);

            // Patient Information
            doc
            .fontSize(11)
            .font("Helvetica-Bold")
            .text("Patient Information");

            doc
            .fontSize(10)
            .font("Helvetica")
            .text(`Name: ${prescriptionData.patientName}`)
            .text(`Email: ${prescriptionData.patientEmail}`)

            doc.moveDown(0.8);

            // Appointment & Prescription Details
            doc
            .fontSize(11)
            .font("Helvetica-Bold")
            .text("Prescription Details");

            doc
            .fontSize(10)
            .font("Helvetica")
            .text(`Prescription ID: ${prescriptionData.prescriptionId}`)
            .text(`Appointment Date: ${new Date(prescriptionData.appointmentDate.toDateString())}`)
            .text(`Issued Date: ${new Date(prescriptionData.createdAt.toDateString())}`)

            if (prescriptionData.followUpDate) {
                doc.text(
                    `Follow-up Date: ${new Date(prescriptionData.followUpDate).toLocaleDateString()}`
                );
            };

            doc.moveDown(1);

            // Horizontal Line
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();

            doc.moveDown(1);

            // Instructions/Medications
            doc.fontSize(11).font("Helvetica-Bold").text("Instructions");
            doc.fontSize(10).font("Helvetica");

            // Wrap text for long instruction

            doc.text(prescriptionData.instructions, {

            });
        }
        catch (error) {}
    });
};