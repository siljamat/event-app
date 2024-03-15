import {Transition} from '@headlessui/react';
import React, {useEffect} from 'react';
import {EventType} from '../types/EventType';
import {useMutation} from '@apollo/client';
import {updateEvent} from '../graphql/eventQueries';
import {doGraphQLFetch} from '../graphql/fetch';
import {getCategories} from '../graphql/categoryQueries';
import {Category} from '../types/Category';

interface EditEventModalProps {
  isOpen: boolean;
  closeModal: () => void;
  event: EventType;
}

/**
 * EditEventModal component allows the user to edit an event.
 * @param {object} props - The props for the EditEventModal component.
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {function} props.closeModal - The function to close the modal.
 * @param {EventType} props.event - The event to be edited.
 * @returns {JSX.Element} The rendered EditEventModal component.
 */
const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  closeModal,
  event,
}) => {
  /**
   * @type {React.State<string>} eventName - The state variable where the event name is stored.
   * @function setEventName - The function to update the eventName state.
   */
  const [eventName, setEventName] = React.useState(event?.event_name || '');
  const [description, setDescription] = React.useState(
    event?.description || '',
  );
  const [date, setDate] = React.useState(event?.date || '');
  const [address, setAddress] = React.useState(event?.address || '');
  const [price, setPrice] = React.useState(event?.price || 0);
  const [ageRestriction, setAgeRestriction] = React.useState(
    event?.age_restriction || 0,
  );
  const [email, setEmail] = React.useState(event?.email || '');
  const [site, setSite] = React.useState(event?.event_site || '');
  const [image, setImage] = React.useState(event?.image || '');

  /**
   * @type {React.State<string[]>} categories - The state variable where the categories are stored.
   * @function setCategories - The function to update the categories state.
   */
  const [categories, setCategories] = React.useState([]);

  /**
   * @type {React.State<string[]>} selectedCategories - The state variable where the selected categories are stored.
   * @function setSelectedCategories - The function to update the selectedCategories state.
   */
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    [],
  );

  const [organizer, setOrganizer] = React.useState(event?.organizer || '');
  const [ticketSite, setTicketSite] = React.useState(event?.ticket_site || '');
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token') || undefined;

  /**
   * @type {object} categoryReplacements - The object that maps category names to their replacements.
   *
   */
  const categoryReplacements: {[key: string]: string} = {
    concert: 'Concerts',
    theatre: 'Theatre',
    liikuntalaji: 'Sports',
    'food & drink': 'Food & Drink',
    outdoors: 'Outdoors',
    community: 'Community',
    workshops: 'Workshops',
    charity: 'Charity',
    children: 'Kids',
  };

  const [updateEventHandle] = useMutation(updateEvent);

  //fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await doGraphQLFetch(API_URL, getCategories, {}, token);
      setCategories(data.categories);
    };

    fetchCategories();
  }, []);

  // Handle checkbox change
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(value)
        ? prevCategories.filter((category) => category !== value)
        : [...prevCategories, value],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateEventHandle({
        variables: {
          updateEventId: event.id,
          input: {
            event_name: eventName || event.event_name,
            description: description || event.description,
            date: date || event.date,
            address: address || event.address,
            price: price || event.price,
            age_restriction: ageRestriction || event.age_restriction,
            email: email || event.email,
            event_site: site || event.event_site,
            image: image || event.image,
            category: selectedCategories || event.category || [],
            organizer: organizer || event.organizer,
            ticket_site: ticketSite || event.ticket_site,
          },
        },
      });

      console.log('Event updated:');
      closeModal();
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  return (
    <>
      <div
        style={{
          width: '100%',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
        }}
      >
        <Transition show={isOpen} as="div">
          <div className="modal-box">
            <h2>Edit Event</h2>
            <p>Add the details you want to add </p>
            <form
              method="dialog"
              onSubmit={handleSubmit}
              className="flex flex-col flex-wrap"
            >
              <button
                className="btn btn-ghost btn-sm btn-circle absolute top-1 right-1"
                onClick={closeModal}
              >
                X
              </button>
              <label style={{marginBottom: '20px'}}>
                <div>Event Name:</div>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="text"
                  placeholder={event?.event_name || ''}
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  style={{marginTop: '5px'}}
                />
              </label>
              <label style={{marginBottom: '20px'}}>
                <div>Description:</div>
                <textarea
                  className="input input-bordered w-full max-w-xs"
                  placeholder={event?.description || ''}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{marginTop: '5px'}}
                />
              </label>
              <label style={{marginBottom: '20px'}}>
                <div>Date:</div>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="date"
                  placeholder={event?.date || ''}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{marginTop: '5px'}}
                />
              </label>
              <label style={{marginBottom: '20px'}}>
                <div>Address:</div>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="text"
                  placeholder={event?.address || ''}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{marginTop: '5px'}}
                />
              </label>
              <label style={{marginBottom: '20px'}}>
                <div>Price:</div>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="text"
                  placeholder={event?.price || ''}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{marginTop: '5px'}}
                />
              </label>
              <label style={{marginBottom: '20px'}}>
                <div>Age Restriction:</div>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="text"
                  placeholder={event?.age_restriction || ''}
                  value={ageRestriction}
                  onChange={(e) => setAgeRestriction(e.target.value)}
                  style={{marginTop: '5px'}}
                />
              </label>
              <label style={{marginBottom: '20px'}}>
                <div>Email:</div>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="text"
                  placeholder={event?.email || ''}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{marginTop: '5px'}}
                />
              </label>
              <label style={{marginBottom: '20px'}}>
                <div>Site:</div>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="text"
                  placeholder={event?.event_site || ''}
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  style={{marginTop: '5px'}}
                />
              </label>
              <label style={{marginBottom: '20px'}}>
                <div>Price:</div>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="text"
                  placeholder={event?.price || ''}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{marginTop: '5px'}}
                />
              </label>
              <label style={{marginBottom: '20px'}}>
                <div>Age Restriction:</div>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="text"
                  placeholder={event?.age_restriction || ''}
                  value={ageRestriction}
                  onChange={(e) => setAgeRestriction(e.target.value)}
                  style={{marginTop: '5px'}}
                />
              </label>
              <label style={{marginBottom: '20px'}}>
                <div>Email:</div>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="text"
                  placeholder={event?.email || ''}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{marginTop: '5px'}}
                />
              </label>
              <label style={{marginBottom: '20px'}}>
                <div>Ticket Site:</div>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="text"
                  placeholder={event?.ticket_site || ''}
                  value={ticketSite}
                  onChange={(e) => setTicketSite(e.target.value)}
                  style={{marginTop: '5px'}}
                />
              </label>
              <label style={{marginBottom: '20px'}}>
                <div>Image:</div>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="text"
                  placeholder={event?.image || ''}
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  style={{marginTop: '5px'}}
                />
              </label>
              <fieldset>
                <legend>Categories</legend>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  {categories.map((category: Category) => {
                    const categoryName =
                      categoryReplacements[
                        category.category_name.toLowerCase()
                      ] || category.category_name;
                    return (
                      <label
                        key={category.id}
                        style={{
                          margin: '1rem',
                        }}
                      >
                        <input
                          type="checkbox"
                          name="category"
                          value={category.id}
                          checked={selectedCategories.includes(category.id)}
                          onChange={handleCheckboxChange}
                        />
                        {categoryName}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <label style={{marginBottom: '20px'}}>
                <div>Organizer:</div>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="text"
                  placeholder={event?.organizer || ''}
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  style={{marginTop: '5px'}}
                />
              </label>
              <button className="btn btn-primary mb-2" type="submit">
                Save Changes
              </button>
              <button className="btn" onClick={closeModal}>
                Cancel
              </button>
            </form>
          </div>
        </Transition>
      </div>
    </>
  );
};

export default EditEventModal;
