const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const hour = date.getHours();

    return `${month} ${day}, ${hour}:00`;
};

const formatAddress = address => `${address.slice(0, 5)}...`;

export default {
    date: formatDate,
    address: formatAddress,
};
