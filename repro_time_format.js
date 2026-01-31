
function formatSlotTimeFixed(slot) {
    // Handle custom slots like "custom-2026-01-21-17:00" or "custom-17:00"
    if (slot.startsWith("custom-")) {
        // Extract the time part (everything after the last hyphen)
        const parts = slot.split("-");
        const timePart = parts[parts.length - 1]; // "17:00"

        // Parse hour - split by ":" first to capture HH from HH:MM
        const hour = parseInt(timePart.split(":")[0]);

        if (isNaN(hour)) return slot;

        const formatHour = (h) => {
            const period = h < 12 ? "AM" : "PM";
            const displayH = h % 12 || 12;
            return `${displayH} ${period}`;
        };

        // Note: The original fix in page.tsx uses (hour + 1) % 24
        // Just assuming slider logic is valid.
        const start = formatHour(hour);
        const end = formatHour((hour + 1) % 24);

        return `${start} - ${end}`;
    }
    return slot;
}

// Test case from user report
const maliciousSlot = "custom-2026-01-21-19:00";

console.log("Fix Logic Output:", formatSlotTimeFixed(maliciousSlot));

// Expected: "7 PM - 8 PM"
const simpleSlot = "custom-20:00";
console.log("Simple Slot Output:", formatSlotTimeFixed(simpleSlot));
// Expected: "8 PM - 9 PM"
