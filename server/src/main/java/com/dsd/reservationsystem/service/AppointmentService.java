package com.dsd.reservationsystem.service;

import com.dsd.reservationsystem.database.Db;
import com.dsd.reservationsystem.models.Appointment;
import com.dsd.reservationsystem.models.AppointmentPostRequest;
import com.dsd.reservationsystem.models.Customer;
import com.dsd.reservationsystem.models.DaySchedule;
import com.google.cloud.firestore.CollectionReference;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@Service
public class AppointmentService {
    private Db database;
    private EmailService emailService;

    private CustomerService customerService;

    public AppointmentService(Db database, EmailService emailService, CustomerService customerService) {
        this.database = database;
        this.emailService = emailService;
        this.customerService = customerService;
    }

    public Appointment saveAppointment(AppointmentPostRequest appointment) {


        //existing or new customer
        Customer customer;


        String customerEmail = appointment.getCustomerInfo().getEmail();
        AppointmentPostRequest.CustomerInfo customerInfo = appointment.getCustomerInfo();
        AppointmentPostRequest.AppointmentTime appointmentTime = appointment.getAppointmentTime();

        //try to find customer info by email
        try {

            //get customer by email
            Optional<Customer> foundCustomer = this.customerService.getCustomerByEmail(customerEmail);


            //no user found. Make new entry and return it
            if (foundCustomer.isEmpty()) {

                //create new customer from request
                Customer newCustomer = new Customer();
                newCustomer.setAddress(customerInfo.getAddress());
                newCustomer.setEmail(customerInfo.getEmail());
                newCustomer.setName(customerInfo.getName());
                newCustomer.setPhoneNumber(customerInfo.getPhoneNumber());


                //create customer in database
                customer = this.customerService.createCustomer(newCustomer);

                System.out.println("createdCustomer");
                System.out.println(customer);
            } else {

                customer = foundCustomer.get();
                System.out.println("customer found");
                System.out.println(customer);
            }

        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        } catch (Exception e) {
            //todo what to do when user not found and exception thrown
            throw new RuntimeException(e);
        }


//        create new appointment from request
        Appointment newAppointment = new Appointment();
        newAppointment.setTimeSlot(appointmentTime.getTimeSlot());
        newAppointment.setDate(appointmentTime.getDay());
        newAppointment.setServiceId(customerInfo.getServiceId());
        newAppointment.setConfirmationNumber(UUID.randomUUID().toString());
        newAppointment.setStatus("PENDING");

        //update appointments on customer
        customer.addAppointment(newAppointment);

        System.out.println("customer new data");
        System.out.println(customer);

        //todo update database with customerchanges

        CollectionReference customersCollection = database.collection("customerInfo");

        customersCollection.document(customer.getId()).set(customer);

        //todo update timeslots with customer id

//    Appointment savedAppointment = this.database.createAppointment(appointment);

        //
        // // Update the timeslot in Firestore to include the customerId
        // DaySchedule daySchedule;
        // try {
        // daySchedule = database.getTimeSlotsForDay(appointment.getDay());
        // } catch (Exception e) {
        // e.printStackTrace();
        // return null;
        // }
        // daySchedule.appointments().get(appointment.getTimeSlot()).setCustomerId(appointment.getCustomerId());
        // database.updateTimeSlotsForDay(appointment.getDay(),
        // daySchedule.appointments());
        //
        // return savedAppointment;

        // Save the appointment to Firestore
        // Appointment savedAppointment = this.database.createAppointment(appointment);

        // Fetch the customer's email
        // Customer customer = database.getCustomerById(appointment.getCustomerId());
        // String customerEmail = customer.getEmail();
        //
        // // Send a confirmation email
        // emailService.sendSimpleMessage(
        // customerEmail,
        // "Appointment Confirmation",
        // "Your appointment has been confirmed. Your confirmation number is " +
        // savedAppointment.getConfirmationNumber()
        // );
        //
        // return savedAppointment;

        return new Appointment();
    }

    public Appointment addAppointmentToCustomer(String customerId, Appointment appointment) {
        // Fetch the customer by ID
        Customer customer = database.getCustomerById(customerId);
        if (customer != null) {
            // Add the new appointment to the customer's list of appointments
            List<Appointment> appointments = customer.getAppointments();
            appointments.add(appointment);
            customer.setAppointments(appointments);

            // Save the customer back to the database
            database.createCustomer(customer);

            // Add the appointment as a time slot for the given date
            DaySchedule daySchedule;
//            try {
//                daySchedule = database.getTimeSlotsForDay(appointment.getDay());
//            } catch (Exception e) {
//                e.printStackTrace();
//                return null;
//            }
//            daySchedule.appointments().put(appointment.getTimeSlot(), appointment);
//            database.updateTimeSlotsForDay(appointment.getDay(), daySchedule.appointments());

            return appointment;
        } else {
            return null;
        }
    }

    public List<Appointment> getAppointmentsForDay(String date) throws ExecutionException, InterruptedException {
        System.out.println("get appointment for day");
        return database.getAppointmentsForDay(date);
    }

}

// // todo find user by there email if they exists update customer info with new
// // appointment
// Query query = database.collection("customerInfo").whereEqualTo("email",
// appointment.getCustomerInfo().getEmail());
// ApiFuture<QuerySnapshot> results = query.get();

// try {

// QuerySnapshot documents = results.get();
// List data = documents.getDocuments();
// System.out.println(data);

// } catch (ExecutionException e) {
// throw new RuntimeException(e);
// } catch (InterruptedException e) {
// throw new RuntimeException(e);
// } catch (Exception e) {
// System.out.printf("unhandled exeption getting customer info");
// }

// todo push user id into timeslot