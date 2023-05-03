Parameters:
  BucketName:
    Type: String
    Description: Name of the existing S3 bucket to modify
  BucketRoleName:
    Type: String
    Description: Name of the IAM role for the S3 bucket
    Default: S3BucketAccessRole
  Environment:
    Type: String
    Description: Environment name
    Default: dev
  HtmlRange:
    Type: String
    Description: IP range for users who can view HTML documents
    Default: 0.0.0.0/0

Resources:
  MyS3BucketPolicy:
    Type: 'AWS::S3::BucketPolicy'
    Properties:
      Bucket: !Ref BucketName
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal: '*'
            Action: 's3:GetObject'
            Resource: !Join ['', ['arn:aws:s3:::', !Ref BucketName, '/datadocs/*']]
            Condition:
              IpAddress:
                aws:SourceIp: !Ref HtmlRange

  MyS3BucketRole:
    Type: 'AWS::IAM::Role'
    Properties:
      RoleName: !Ref BucketRoleName
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: s3.amazonaws.com
            Action: 'sts:AssumeRole'
      Policies:
        - PolicyName: S3BucketAccessPolicy
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - 's3:PutObject'
                  - 's3:GetObject'
                  - 's3:DeleteObject'
                Resource:
                  - !Join ['', ['arn:aws:s3:::', !Ref BucketName, '/*']]
      Tags:
        - Key: Environment
          Value: !Ref Environment
        - Key: Owner
          Value: CloudFormation
