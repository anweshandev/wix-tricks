import { queryAvailability, createBooking } from 'backend/WixBookings';
import { createCheckout, getCheckoutUrl } from 'backend/WixEcom';
import wixWindow from 'wix-window';
import wixLocation from 'wix-location';

const WIX_BOOKINGS_APP_DEF_ID = "13d21c63-b5ec-5912-8397-c3a5ddb27a97";
let entries, slotForBookings
let contactDetails = {
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
}

$w.onReady(async function () {

    const pageData = await wixWindow.getAppPageData();
    console.log('pageData:', pageData);
    $w('#serviceName').text = pageData.service.name
    $w('#time').text = formatTimeAsHoursAndMinutes(pageData.service.schedule.firstSessionStart)

    const serviceId = pageData.service.id

    const selectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const options = {
        timezone: selectedTimezone
    };
    entries = await queryAvailability(serviceId, options);
    console.log('entries:', entries);
    setDatePicker(entries)
    setEvents()
});

function setEvents() {
    $w('#datePicker').onChange(() => {
        let selectedDate = $w('#datePicker').value
        console.log('selectedDate:', selectedDate);
        slotForBookings = entries.filter(entry => new Date(entry.slot.startDate).toLocaleDateString().includes(new Date(selectedDate).toLocaleDateString()))[0]
        console.log('slotForBookings', slotForBookings);
        $w('#numberOfParticipantsInput').max = slotForBookings.openSpots
        
    })

    $w('#fullNameInput').onChange(() => {
        contactDetails.firstName = $w('#fullNameInput').value.split(' ')[0]
        contactDetails.lastName = $w('#fullNameInput').value.split(' ')[1]
    })

    $w('#emailInput').onChange(() => {
        contactDetails.email = $w('#emailInput').value
    })

    $w('#phoneInput').onChange(() => {
        contactDetails.phone = $w('#phoneInput').value
    })

    $w('#continueButton').onClick(async () => {
        createBookingsAndCheckout()
    })
}

function setDatePicker(availability) {
    const availableDates = []
    availability.forEach(availableTime => {
        availableDates.push({
            startDate: new Date(new Date(availableTime.slot.startDate).toLocaleDateString()),
            endDate: new Date(new Date(availableTime.slot.startDate).toLocaleDateString())
        })
    })
    $w('#datePicker').enabledDateRanges = availableDates;
    $w('#datePicker').enable()
}

function formatTimeAsHoursAndMinutes(isoString) {
    const date = new Date(isoString);

    if (isNaN(date)) {
        return 'Invalid Date';
    }

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
}

async function createBookingsAndCheckout() {

    //Create a Booking. 
    const bookingObject = {
        totalParticipants: Number($w('#numberOfParticipantsInput').value),
        bookingSource: {
            actor: "CUSTOMER",
            platform: "WEB"
        },
        contactDetails: {
            firstName: contactDetails.firstName,
            lastName:  contactDetails.lastName,
            email: contactDetails.email,
            phone: contactDetails.phone,
        },

        bookedEntity: {
            slot: {
                sessionId: slotForBookings.slot.sessionId
            }
        }
    }

    let createdBooking = await createBooking(bookingObject, {});
    console.log('createdBooking:', createdBooking);
    // Create Checkout
    const options = {
        lineItems: [{
            quantity: 1,
            catalogReference: {
                // Wix Bookings app Id
                appId: WIX_BOOKINGS_APP_DEF_ID,
                // Wix Bookings bookings Id
                catalogItemId: createdBooking.booking._id 
            }
        }],
        checkoutInfo: {
            billingInfo: {
                contactDetails: {
                    firstName: contactDetails.firstName,
                    lastName:  contactDetails.lastName,
                    phone: contactDetails.phone
                }
            },
            buyerInfo: {
                email: contactDetails.email,
            }
        },
        channelType: "WEB"
    }
    console.log('Checkout options:', options);
    let createCheckoutEcom = await createCheckout(options)
    console.log('createCheckoutEcom:', createCheckoutEcom);

    //Redirect to checkout page
    let urlObject = await getCheckoutUrl(createCheckoutEcom._id)
    console.log("Will redirect to URL:", urlObject.checkoutUrl)
    wixLocation.to(urlObject.checkoutUrl)
}