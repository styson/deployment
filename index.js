console.log('Loading function');

exports.handler = function(event, context) {
    //console.log(JSON.stringify(event, null, 2));
    event.Records.forEach(function(record) {
        // Kinesis data is base64 encoded so decode here
        var payload = Buffer.from(record.kinesis.data, 'base64').toString('ascii');
        console.log('Decoded payload:', payload);
    });
};

// https://docs.aws.amazon.com/lambda/latest/dg/with-kinesis-example.html

// aws kinesis create-stream --stream-name lambda-stream --shard-count 1

// aws kinesis describe-stream --stream-name lambda-stream

// aws lambda create-function --function-name ProcessKinesisRecords \
// --zip-file fileb://function.zip --handler index.handler --runtime nodejs14.x \
// --role arn:aws:iam::888985673581:role/test-lambda-kinesis-role

// aws lambda create-event-source-mapping --function-name ProcessKinesisRecords \
// --event-source  arn:aws:kinesis:us-west-2:888985673581:stream/lambda-stream \
// --batch-size 100 --starting-position LATEST

// aws lambda list-event-source-mappings --function-name ProcessKinesisRecords \
// --event-source arn:aws:kinesis:us-west-2:888985673581:stream/lambda-stream

// aws lambda invoke --function-name ProcessKinesisRecords --payload file://input.txt out.txt --cli-binary-format raw-in-base64-out

// aws kinesis put-record --stream-name lambda-stream --partition-key 1 \
// --data "Hello, this is a test."



// To update a function by using the Lambda API, use the UpdateFunctionCode operation.
// Create an archive that contains your function code, and upload it using the AWS Command Line Interface (AWS CLI).

//  zip function.zip index.js

//  aws lambda update-function-code --function-name my-function --zip-file fileb://function.zip
