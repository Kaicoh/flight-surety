import faker from 'faker';

export const { uuid } = faker.random;

export const fakeFlightNumber = () => (
    `${faker.address.countryCode()}${faker.random.number(9)}${faker.random.number(9)}${faker.random.number(9)}${faker.random.number(9)}`
);

export const timestamp = hour => new Date().setHours(hour, 0, 0, 0);

export const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const hour = date.getHours();

    return `${month} ${day}, ${hour}:00`;
};
